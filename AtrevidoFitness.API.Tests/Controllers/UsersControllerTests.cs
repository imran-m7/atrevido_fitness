using AtrevidoFitness.API.Controllers;
using AtrevidoFitness.API.Data;
using AtrevidoFitness.API.DTOs;
using AtrevidoFitness.API.Models.Entities;
using AtrevidoFitness.API.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AtrevidoFitness.API.Tests.Controllers;

public class UsersControllerTests
{
    private UsersController CreateController(AppDbContext context, int userId, string role = "Member")
    {
        var controller = new UsersController(context);
        var user = role == "Admin" ? TestUserFactory.CreateAdminUser(userId) : TestUserFactory.CreateMemberUser(userId);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = TestUserFactory.CreateHttpContextWithUser(user)
        };
        return controller;
    }

    [Fact]
    public async Task GetProfile_ReturnsUserProfile_WhenUserExists()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        var user = new User
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            Email = "john@example.com",
            PasswordHash = "hash",
            PhoneNumber = "1234567890",
            Role = "Member",
            IsActive = true
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetProfile();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var profile = Assert.IsType<UserProfileResponseDto>(okResult.Value);
        
        Assert.Equal(1, profile.Id);
        Assert.Equal("John", profile.FirstName);
        Assert.Equal("Doe", profile.LastName);
        Assert.Equal("johndoe", profile.Username);
        Assert.Equal("john@example.com", profile.Email);
        Assert.Equal("1234567890", profile.PhoneNumber);
        Assert.Equal("Member", profile.Role);
        Assert.True(profile.IsActive);
    }

    [Fact]
    public async Task GetProfile_ReturnsNotFound_WhenUserDoesNotExist()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 999); // Non-existent user ID

        // Act
        var result = await controller.GetProfile();

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task GetProfile_IncludesTrainingMembership_WhenExists()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        var user = new User
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            Email = "john@example.com",
            PasswordHash = "hash",
            Role = "Member",
            IsActive = true
        };
        var membership = new UserTrainingMembership
        {
            Id = 1,
            UserId = 1,
            TrainingType = "Group",
            Status = "Active",
            NutritionEnabled = false,
            PaymentStatus = "Paid"
        };
        user.TrainingMembership = membership;
        context.Users.Add(user);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetProfile();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var profile = Assert.IsType<UserProfileResponseDto>(okResult.Value);
        
        Assert.Equal("Group", profile.MembershipType);
        Assert.Equal("Active", profile.MembershipStatus);
        Assert.False(profile.NutritionEnabled);
    }

    [Fact]
    public async Task UpdateProfile_UpdatesUserData_WhenValid()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        var user = new User
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            Email = "john@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("OldPass123!"),
            PhoneNumber = "1234567890",
            Role = "Member",
            IsActive = true
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var updateDto = new UserProfileDto
        {
            FirstName = "Jane",
            LastName = "Smith",
            PhoneNumber = "9876543210",
            Username = null,
            NewPassword = null
        };

        // Act
        var result = await controller.UpdateProfile(updateDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        
        var updatedUser = await context.Users.FindAsync(1);
        Assert.NotNull(updatedUser);
        Assert.Equal("Jane", updatedUser.FirstName);
        Assert.Equal("Smith", updatedUser.LastName);
        Assert.Equal("9876543210", updatedUser.PhoneNumber);
    }

    [Fact]
    public async Task UpdateProfile_UpdatesUsername_WhenValid()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        var user = new User
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            Email = "john@example.com",
            PasswordHash = "hash",
            Role = "Member",
            IsActive = true
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var updateDto = new UserProfileDto
        {
            FirstName = "John",
            LastName = "Doe",
            PhoneNumber = "1234567890",
            Username = "neweusername",
            NewPassword = null
        };

        // Act
        var result = await controller.UpdateProfile(updateDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        
        var updatedUser = await context.Users.FindAsync(1);
        Assert.NotNull(updatedUser);
        Assert.Equal("neweusername", updatedUser.Username);
    }

    [Fact]
    public async Task UpdateProfile_ReturnsBadRequest_WhenUsernameAlreadyTaken()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        var user1 = new User
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            Email = "john@example.com",
            PasswordHash = "hash",
            Role = "Member"
        };
        var user2 = new User
        {
            Id = 2,
            FirstName = "Jane",
            LastName = "Smith",
            Username = "janesmith",
            Email = "jane@example.com",
            PasswordHash = "hash",
            Role = "Member"
        };
        context.Users.AddRange(user1, user2);
        await context.SaveChangesAsync();

        var updateDto = new UserProfileDto
        {
            FirstName = "John",
            LastName = "Doe",
            PhoneNumber = "1234567890",
            Username = "janesmith", // Already taken by user 2
            NewPassword = null
        };

        // Act
        var result = await controller.UpdateProfile(updateDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task UpdateProfile_CannotUpdatePassword_WithInMemoryDatabase()
    {
        // Note: Password updates use raw SQL (ExecuteSqlRaw) which is not supported by InMemory database
        // This test documents that password updates require a relational database provider
        // The controller's password update functionality is tested against SQL Server in integration tests
        
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        var user = new User
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            Email = "john@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("OldPass123!"),
            Role = "Member",
            IsActive = true
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var updateDto = new UserProfileDto
        {
            FirstName = "John",
            LastName = "Doe",
            PhoneNumber = "1234567890",
            Username = null,
            NewPassword = "NewPass456!"
        };

        // Act & Assert
        // This will throw because InMemory doesn't support ExecuteSqlRaw
        await Assert.ThrowsAsync<InvalidOperationException>(
            async () => await controller.UpdateProfile(updateDto)
        );
    }

    [Fact]
    public async Task UpdateProfile_ValidatesPasswordLength_WhenProvidingNewPassword()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        var user = new User
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            Email = "john@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("OldPass123!"),
            Role = "Member"
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var updateDto = new UserProfileDto
        {
            FirstName = "John",
            LastName = "Doe",
            PhoneNumber = "1234567890",
            Username = null,
            NewPassword = "short" // Too short
        };

        // Act
        var result = await controller.UpdateProfile(updateDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task UpdateProfile_ValidatesPasswordRequirements_WhenProvidingPassword()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        var user = new User
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            Email = "john@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("OldPass123!"),
            Role = "Member"
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var updateDto = new UserProfileDto
        {
            FirstName = "John",
            LastName = "Doe",
            PhoneNumber = "1234567890",
            Username = null,
            NewPassword = "lowercase123!" // Missing uppercase
        };

        // Act
        var result = await controller.UpdateProfile(updateDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task UpdateProfile_ReturnsNotFound_WhenUserDoesNotExist()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 999); // Non-existent user

        var updateDto = new UserProfileDto
        {
            FirstName = "John",
            LastName = "Doe",
            PhoneNumber = "1234567890",
            Username = null,
            NewPassword = null
        };

        // Act
        var result = await controller.UpdateProfile(updateDto);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task GetProfile_IncludesProfileImageBase64()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        var profileImage = "data:image/png;base64,iVBORw0KGgoAAAANS...";
        var user = new User
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            Email = "john@example.com",
            PasswordHash = "hash",
            Role = "Member",
            IsActive = true,
            ProfileImageBase64 = profileImage
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetProfile();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var profile = Assert.IsType<UserProfileResponseDto>(okResult.Value);
        Assert.Equal(profileImage, profile.ProfileImageBase64);
    }

    [Fact]
    public async Task UpdateProfile_UpdatesProfileImage()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        var newProfileImage = "data:image/png;base64,NewImage...";
        var user = new User
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            Email = "john@example.com",
            PasswordHash = "hash",
            Role = "Member",
            IsActive = true
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var updateDto = new UserProfileDto
        {
            FirstName = "John",
            LastName = "Doe",
            PhoneNumber = "1234567890",
            Username = null,
            NewPassword = null,
            ProfileImageBase64 = newProfileImage
        };

        // Act
        var result = await controller.UpdateProfile(updateDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        
        var updatedUser = await context.Users.FindAsync(1);
        Assert.NotNull(updatedUser);
        Assert.Equal(newProfileImage, updatedUser.ProfileImageBase64);
    }
}
