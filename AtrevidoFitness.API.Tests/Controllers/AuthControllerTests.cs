using AtrevidoFitness.API.Controllers;
using AtrevidoFitness.API.Data;
using AtrevidoFitness.API.DTOs;
using AtrevidoFitness.API.Helpers;
using AtrevidoFitness.API.Models.Entities;
using AtrevidoFitness.API.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;

namespace AtrevidoFitness.API.Tests.Controllers;

public class AuthControllerTests
{
    private JwtHelper CreateJwtHelper()
    {
        var configMock = new Mock<IConfiguration>();
        var jwtSettingsMock = new Mock<IConfigurationSection>();
        
        jwtSettingsMock.Setup(x => x["SecretKey"]).Returns("this_is_a_very_long_secret_key_for_testing_purposes_only");
        jwtSettingsMock.Setup(x => x["Issuer"]).Returns("TestIssuer");
        jwtSettingsMock.Setup(x => x["Audience"]).Returns("TestAudience");
        
        configMock.Setup(x => x.GetSection("JwtSettings")).Returns(jwtSettingsMock.Object);
        
        return new JwtHelper(configMock.Object);
    }

    private AuthController CreateController(AppDbContext context)
    {
        var jwtHelper = CreateJwtHelper();
        return new AuthController(context, jwtHelper);
    }

    [Fact]
    public async Task Register_CreatesNewUser_WhenCredentialsAreValid()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        var registerDto = new UserCreateDto
        {
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            Email = "john@example.com",
            Password = "SecurePass123!",
            PhoneNumber = "1234567890"
        };

        // Act
        var result = await controller.Register(registerDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var response = Assert.IsType<AuthResponseDto>(okResult.Value);
        
        Assert.Equal("johndoe", response.Username);
        Assert.Equal("John", response.FirstName);
        Assert.Equal("Member", response.Role);
        Assert.False(response.IsActive);
        Assert.NotEmpty(response.Token);

        // Verify user was saved to database
        var savedUser = await context.Users.FindAsync(response.Id);
        Assert.NotNull(savedUser);
        Assert.Equal("johndoe", savedUser.Username);
        Assert.Equal("john@example.com", savedUser.Email?.ToLower());
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenUsernameAlreadyExists()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        var existingUser = new User
        {
            Id = 1,
            FirstName = "Jane",
            LastName = "Smith",
            Username = "johndoe",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
            Role = "Member"
        };
        context.Users.Add(existingUser);
        await context.SaveChangesAsync();

        var registerDto = new UserCreateDto
        {
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            Email = "john@example.com",
            Password = "SecurePass123!",
            PhoneNumber = "1234567890"
        };

        // Act
        var result = await controller.Register(registerDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenPasswordTooShort()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        var registerDto = new UserCreateDto
        {
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            Email = "john@example.com",
            Password = "Pass!", // Only 5 chars
            PhoneNumber = "1234567890"
        };

        // Act
        var result = await controller.Register(registerDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenPasswordMissingUppercase()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        var registerDto = new UserCreateDto
        {
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            Email = "john@example.com",
            Password = "password123!", // Missing uppercase
            PhoneNumber = "1234567890"
        };

        // Act
        var result = await controller.Register(registerDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenPasswordMissingSpecialChar()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        var registerDto = new UserCreateDto
        {
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            Email = "john@example.com",
            Password = "Password123", // Missing special character
            PhoneNumber = "1234567890"
        };

        // Act
        var result = await controller.Register(registerDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Login_ReturnsOk_WhenCredentialsAreValid()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        var password = "SecurePass123!";
        var user = new User
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            Email = "john@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Role = "Member",
            IsActive = true
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var loginDto = new LoginDto
        {
            Username = "johndoe",
            Password = password
        };

        // Act
        var result = await controller.Login(loginDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var response = Assert.IsType<AuthResponseDto>(okResult.Value);
        
        Assert.Equal(1, response.Id);
        Assert.Equal("johndoe", response.Username);
        Assert.Equal("John", response.FirstName);
        Assert.Equal("Member", response.Role);
        Assert.True(response.IsActive);
        Assert.NotEmpty(response.Token);
    }

    [Fact]
    public async Task Login_ReturnsUnauthorized_WhenPasswordIsWrong()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        var user = new User
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            Email = "john@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPass123!"),
            Role = "Member",
            IsActive = true
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var loginDto = new LoginDto
        {
            Username = "johndoe",
            Password = "WrongPassword123!"
        };

        // Act
        var result = await controller.Login(loginDto);

        // Assert
        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public async Task Login_ReturnsUnauthorized_WhenUserDoesNotExist()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        var loginDto = new LoginDto
        {
            Username = "nonexistent",
            Password = "Password123!"
        };

        // Act
        var result = await controller.Login(loginDto);

        // Assert
        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public async Task Login_IsCaseInsensitiveForUsername()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        var password = "SecurePass123!";
        var user = new User
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            Email = "john@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Role = "Member",
            IsActive = true
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var loginDto = new LoginDto
        {
            Username = "JOHNDOE", // uppercase
            Password = password
        };

        // Act
        var result = await controller.Login(loginDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task Register_IsCaseInsensitiveForUsername()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        var registerDto = new UserCreateDto
        {
            FirstName = "John",
            LastName = "Doe",
            Username = "JOHNDOE", // will be lowercased
            Email = "john@example.com",
            Password = "SecurePass123!",
            PhoneNumber = "1234567890"
        };

        // Act
        var result = await controller.Register(registerDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var response = Assert.IsType<AuthResponseDto>(okResult.Value);
        Assert.Equal("johndoe", response.Username);
    }
}
