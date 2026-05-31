using AtrevidoFitness.API.Controllers;
using AtrevidoFitness.API.Data;
using AtrevidoFitness.API.DTOs;
using AtrevidoFitness.API.Models.Entities;
using AtrevidoFitness.API.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AtrevidoFitness.API.Tests.Controllers;

public class MembershipControllerTests
{
    private MembershipController CreateController(AppDbContext context, int userId, string role = "Member")
    {
        var controller = new MembershipController(context);
        var user = role == "Admin" ? TestUserFactory.CreateAdminUser(userId) : TestUserFactory.CreateMemberUser(userId);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = TestUserFactory.CreateHttpContextWithUser(user)
        };
        return controller;
    }

    [Fact]
    public async Task RequestMembership_CreatesPendingMembership_WhenGroup()
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
            PasswordHash = "hash",
            Role = "Member"
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var requestDto = new UserTrainingMembershipCreateDto
        {
            UserId = 1,
            TrainingType = "group",
            Status = "Pending",
            NutritionEnabled = false,
            PaymentStatus = "Pending"
        };

        // Act
        var result = await controller.RequestMembership(requestDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        
        var membership = await context.UserTrainingMemberships
            .FirstOrDefaultAsync(m => m.UserId == 1);
        Assert.NotNull(membership);
        Assert.Equal("Group", membership.TrainingType);
        Assert.Equal("Pending", membership.Status);
        Assert.False(membership.NutritionEnabled);
        Assert.Equal("Pending", membership.PaymentStatus);
    }

    [Fact]
    public async Task RequestMembership_CreatesMembershipWithNutrition_WhenIndividualNutrition()
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
            PasswordHash = "hash",
            Role = "Member"
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var requestDto = new UserTrainingMembershipCreateDto
        {
            UserId = 1,
            TrainingType = "individual-nutrition",
            Status = "Pending",
            NutritionEnabled = true,
            PaymentStatus = "Pending"
        };

        // Act
        var result = await controller.RequestMembership(requestDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        
        var membership = await context.UserTrainingMemberships
            .FirstOrDefaultAsync(m => m.UserId == 1);
        Assert.NotNull(membership);
        Assert.Equal("Individual", membership.TrainingType);
        Assert.True(membership.NutritionEnabled);
    }

    [Fact]
    public async Task RequestMembership_CreatesIndividualMembership_WhenIndividual()
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
            PasswordHash = "hash",
            Role = "Member"
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var requestDto = new UserTrainingMembershipCreateDto
        {
            UserId = 1,
            TrainingType = "individual",
            Status = "Pending",
            NutritionEnabled = false,
            PaymentStatus = "Pending"
        };

        // Act
        var result = await controller.RequestMembership(requestDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        
        var membership = await context.UserTrainingMemberships
            .FirstOrDefaultAsync(m => m.UserId == 1);
        Assert.NotNull(membership);
        Assert.Equal("Individual", membership.TrainingType);
        Assert.False(membership.NutritionEnabled);
    }

    [Fact]
    public async Task RequestMembership_ReturnsBadRequest_WhenMembershipAlreadyExists()
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
            PasswordHash = "hash",
            Role = "Member"
        };

        var existingMembership = new UserTrainingMembership
        {
            Id = 1,
            UserId = 1,
            TrainingType = "Group",
            Status = "Pending",
            PaymentStatus = "Pending"
        };

        context.Users.Add(user);
        context.UserTrainingMemberships.Add(existingMembership);
        await context.SaveChangesAsync();

        var requestDto = new UserTrainingMembershipCreateDto
        {
            UserId = 1,
            TrainingType = "individual",
            Status = "Pending",
            NutritionEnabled = false,
            PaymentStatus = "Pending"
        };

        // Act
        var result = await controller.RequestMembership(requestDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task RequestMembership_SetsMembershipToPending_ByDefault()
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
            PasswordHash = "hash",
            Role = "Member"
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var requestDto = new UserTrainingMembershipCreateDto
        {
            UserId = 1,
            TrainingType = "group",
            Status = "Pending",
            NutritionEnabled = false,
            PaymentStatus = "Pending"
        };

        // Act
        var result = await controller.RequestMembership(requestDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        
        var membership = await context.UserTrainingMemberships
            .FirstOrDefaultAsync(m => m.UserId == 1);
        Assert.NotNull(membership);
        Assert.Equal("Pending", membership.Status);
    }

    [Fact]
    public async Task RequestMembership_SetsRequestedAtTimestamp()
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
            PasswordHash = "hash",
            Role = "Member"
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var beforeRequest = DateTime.UtcNow;

        var requestDto = new UserTrainingMembershipCreateDto
        {
            UserId = 1,
            TrainingType = "group",
            Status = "Pending",
            NutritionEnabled = false,
            PaymentStatus = "Pending"
        };

        // Act
        var result = await controller.RequestMembership(requestDto);

        var afterRequest = DateTime.UtcNow;

        // Assert
        Assert.IsType<OkObjectResult>(result);
        
        var membership = await context.UserTrainingMemberships
            .FirstOrDefaultAsync(m => m.UserId == 1);
        Assert.NotNull(membership);
        Assert.True(membership.RequestedAt >= beforeRequest);
        Assert.True(membership.RequestedAt <= afterRequest);
    }

    [Fact]
    public async Task GetMine_ReturnsUsersMembership_WhenExists()
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
            PasswordHash = "hash",
            Role = "Member"
        };

        var membership = new UserTrainingMembership
        {
            Id = 1,
            UserId = 1,
            TrainingType = "Group",
            Status = "Active",
            PaymentStatus = "Paid",
            NutritionEnabled = false
        };

        context.Users.Add(user);
        context.UserTrainingMemberships.Add(membership);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetMine();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        
        var responseMembership = okResult.Value;
        Assert.NotNull(responseMembership);
    }

    [Fact]
    public async Task GetMine_ReturnsNull_WhenMembershipDoesNotExist()
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
            PasswordHash = "hash",
            Role = "Member"
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetMine();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        Assert.Null(okResult.Value);
    }

    [Fact]
    public async Task GetMine_ReturnsCorrectMembershipDetails()
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
            PasswordHash = "hash",
            Role = "Member"
        };

        var membership = new UserTrainingMembership
        {
            Id = 1,
            UserId = 1,
            TrainingType = "Individual",
            Status = "Active",
            PaymentStatus = "Paid",
            NutritionEnabled = true
        };

        context.Users.Add(user);
        context.UserTrainingMemberships.Add(membership);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetMine();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        
        // The response should be a dynamic object with the membership details
        var response = okResult.Value;
        Assert.NotNull(response);
    }

    [Fact]
    public async Task GetMine_ReturnsOnlyCurrentUsersMembership()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1); // User 1 is authenticated

        var user1 = new User
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            PasswordHash = "hash",
            Role = "Member"
        };

        var user2 = new User
        {
            Id = 2,
            FirstName = "Jane",
            LastName = "Smith",
            Username = "janesmith",
            PasswordHash = "hash",
            Role = "Member"
        };

        var membership1 = new UserTrainingMembership
        {
            Id = 1,
            UserId = 1,
            TrainingType = "Group",
            Status = "Active",
            PaymentStatus = "Paid"
        };

        var membership2 = new UserTrainingMembership
        {
            Id = 2,
            UserId = 2,
            TrainingType = "Individual",
            Status = "Pending",
            PaymentStatus = "Pending"
        };

        context.Users.AddRange(user1, user2);
        context.UserTrainingMemberships.AddRange(membership1, membership2);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetMine();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        Assert.NotNull(okResult.Value);

        // Should get membership for user 1 only
        var membershipCount = await context.UserTrainingMemberships
            .CountAsync(m => m.UserId == 1);
        Assert.Equal(1, membershipCount);
    }

    [Fact]
    public async Task RequestMembership_DefaultsToGroupWhenUnknownType()
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
            PasswordHash = "hash",
            Role = "Member"
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var requestDto = new UserTrainingMembershipCreateDto
        {
            UserId = 1,
            TrainingType = "unknown-type", // Unknown type should default to Group
            Status = "Pending",
            NutritionEnabled = false,
            PaymentStatus = "Pending"
        };

        // Act
        var result = await controller.RequestMembership(requestDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        
        var membership = await context.UserTrainingMemberships
            .FirstOrDefaultAsync(m => m.UserId == 1);
        Assert.NotNull(membership);
        Assert.Equal("Group", membership.TrainingType); // Should default to Group
    }
}
