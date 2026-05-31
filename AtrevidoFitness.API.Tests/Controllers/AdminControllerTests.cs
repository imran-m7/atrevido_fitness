using AtrevidoFitness.API.Controllers;
using AtrevidoFitness.API.Data;
using AtrevidoFitness.API.DTOs;
using AtrevidoFitness.API.Models.Entities;
using AtrevidoFitness.API.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AtrevidoFitness.API.Tests.Controllers;

public class AdminControllerTests
{
    private static AdminController CreateController(AppDbContext context, int adminUserId = 99)
    {
        var controller = new AdminController(context);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = TestUserFactory.CreateHttpContextWithUser(
                TestUserFactory.CreateAdminUser(adminUserId))
        };

        return controller;
    }

    private static User CreateMember(int id, string firstName, string lastName, bool isActive = true)
    {
        return new User
        {
            Id = id,
            FirstName = firstName,
            LastName = lastName,
            Username = $"{firstName}.{lastName}".ToLowerInvariant(),
            Email = $"{firstName}.{lastName}@example.com".ToLowerInvariant(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("OldPass123!"),
            PhoneNumber = "123456789",
            Role = "Member",
            IsActive = isActive,
            CreatedAt = new DateTime(2026, 1, id, 0, 0, 0, DateTimeKind.Utc)
        };
    }

    private static object? GetProperty(object source, string propertyName)
    {
        return source.GetType().GetProperty(propertyName)?.GetValue(source);
    }

    [Fact]
    public async Task GetMembers_ReturnsAllMembers()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        context.Users.AddRange(
            CreateMember(1, "Alice", "Johnson"),
            CreateMember(2, "Bob", "Smith", isActive: false),
            new User
            {
                Id = 3,
                FirstName = "Admin",
                LastName = "User",
                Username = "admin.user",
                PasswordHash = "hash",
                Role = "Admin",
                IsActive = true
            });
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetMembers();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var members = Assert.IsAssignableFrom<IEnumerable<object>>(okResult.Value).ToList();

        Assert.Equal(2, members.Count);
        Assert.Contains(members, m => (int)GetProperty(m, "Id")! == 1);
        Assert.Contains(members, m => (int)GetProperty(m, "Id")! == 2);
        Assert.DoesNotContain(members, m => (int)GetProperty(m, "Id")! == 3);
    }

    [Fact]
    public async Task GetMembers_ReturnsMembershipsWithUsers()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        var member = CreateMember(1, "Alice", "Johnson");
        member.TrainingMembership = new UserTrainingMembership
        {
            Id = 10,
            UserId = 1,
            TrainingType = "Individual",
            Status = "Active",
            PaymentStatus = "Paid",
            NutritionEnabled = true,
            RequestedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            ActivatedAt = new DateTime(2026, 1, 2, 0, 0, 0, DateTimeKind.Utc),
            EndDate = new DateTime(2026, 2, 1, 0, 0, 0, DateTimeKind.Utc),
            AdminNotes = "Approved"
        };

        context.Users.Add(member);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetMembers();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnedMember = Assert.IsAssignableFrom<IEnumerable<object>>(okResult.Value).Single();
        var membership = GetProperty(returnedMember, "Membership");
        Assert.NotNull(membership);

        Assert.Equal("Individual", GetProperty(membership, "TrainingType"));
        Assert.Equal("Active", GetProperty(membership, "Status"));
        Assert.Equal("Paid", GetProperty(membership, "PaymentStatus"));
        Assert.True((bool)GetProperty(membership, "NutritionEnabled")!);
        Assert.Equal("Approved", GetProperty(membership, "AdminNotes"));
    }

    [Fact]
    public async Task UpdateUserStatus_UpdatesUser_WhenExists()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        context.Users.Add(CreateMember(1, "Alice", "Johnson", isActive: false));
        await context.SaveChangesAsync();

        var dto = new UserStatusUpdateDto { IsActive = true };

        // Act
        var result = await controller.UpdateUserStatus(1, dto);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        var user = await context.Users.FindAsync(1);
        Assert.NotNull(user);
        Assert.True(user.IsActive);
    }

    [Fact]
    public async Task UpdateUserStatus_ReturnsNotFound_WhenUserMissing()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);
        var dto = new UserStatusUpdateDto { IsActive = true };

        // Act
        var result = await controller.UpdateUserStatus(999, dto);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task ResetMemberPassword_UpdatesPassword_WhenUserExists()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        context.Users.Add(CreateMember(1, "Alice", "Johnson"));
        await context.SaveChangesAsync();

        var dto = new AdminResetPasswordDto { NewPassword = "NewPass123!" };

        // Act
        var result = await controller.ResetMemberPassword(1, dto);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        var user = await context.Users.FindAsync(1);
        Assert.NotNull(user);
        Assert.True(BCrypt.Net.BCrypt.Verify("NewPass123!", user.PasswordHash));
        Assert.False(BCrypt.Net.BCrypt.Verify("OldPass123!", user.PasswordHash));
    }

    [Fact]
    public async Task ResetMemberPassword_ReturnsNotFound_WhenUserMissing()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);
        var dto = new AdminResetPasswordDto { NewPassword = "NewPass123!" };

        // Act
        var result = await controller.ResetMemberPassword(999, dto);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task ResetMemberPassword_ReturnsBadRequest_WhenPasswordInvalid()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        context.Users.Add(CreateMember(1, "Alice", "Johnson"));
        await context.SaveChangesAsync();

        var dto = new AdminResetPasswordDto { NewPassword = "short" };

        // Act
        var result = await controller.ResetMemberPassword(1, dto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);

        var user = await context.Users.FindAsync(1);
        Assert.NotNull(user);
        Assert.True(BCrypt.Net.BCrypt.Verify("OldPass123!", user.PasswordHash));
    }

    [Fact]
    public async Task UpdateMembership_CreatesMembership_WhenMissing()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        context.Users.Add(CreateMember(1, "Alice", "Johnson"));
        await context.SaveChangesAsync();

        var dto = new UserTrainingMembershipUpdateDto
        {
            TrainingType = "Group",
            Status = "Pending",
            PaymentStatus = "Pending",
            NutritionEnabled = false,
            AdminNotes = "Waiting for payment"
        };

        // Act
        var result = await controller.UpdateMembership(1, dto);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        var membership = await context.UserTrainingMemberships.SingleOrDefaultAsync(m => m.UserId == 1);
        Assert.NotNull(membership);
        Assert.Equal("Group", membership.TrainingType);
        Assert.Equal("Pending", membership.Status);
        Assert.Equal("Pending", membership.PaymentStatus);
        Assert.False(membership.NutritionEnabled);
        Assert.Equal("Waiting for payment", membership.AdminNotes);
    }

    [Fact]
    public async Task UpdateMembership_UpdatesMembership_WhenExists()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        context.Users.Add(CreateMember(1, "Alice", "Johnson"));
        context.UserTrainingMemberships.Add(new UserTrainingMembership
        {
            Id = 10,
            UserId = 1,
            TrainingType = "Group",
            Status = "Pending",
            PaymentStatus = "Pending",
            NutritionEnabled = false,
            AdminNotes = "Initial"
        });
        await context.SaveChangesAsync();

        var dto = new UserTrainingMembershipUpdateDto
        {
            TrainingType = "Individual",
            Status = "Active",
            PaymentStatus = "Paid",
            NutritionEnabled = true,
            AdminNotes = "Approved"
        };

        // Act
        var result = await controller.UpdateMembership(1, dto);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        var membership = await context.UserTrainingMemberships.SingleAsync(m => m.UserId == 1);
        Assert.Equal("Individual", membership.TrainingType);
        Assert.Equal("Active", membership.Status);
        Assert.Equal("Paid", membership.PaymentStatus);
        Assert.True(membership.NutritionEnabled);
        Assert.Equal("Approved", membership.AdminNotes);
        Assert.NotNull(membership.ActivatedAt);
        Assert.NotNull(membership.EndDate);
    }

    [Fact]
    public async Task UpdateMembership_UpdatesEndDate_WhenStatusActiveProvided()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        context.Users.Add(CreateMember(1, "Alice", "Johnson"));
        context.UserTrainingMemberships.Add(new UserTrainingMembership
        {
            Id = 10,
            UserId = 1,
            TrainingType = "Group",
            Status = "Pending",
            PaymentStatus = "Pending",
            NutritionEnabled = false
        });
        await context.SaveChangesAsync();

        var dto = new UserTrainingMembershipUpdateDto { Status = "Active" };

        // Act
        var result = await controller.UpdateMembership(1, dto);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        var membership = await context.UserTrainingMemberships.SingleAsync(m => m.UserId == 1);
        Assert.Equal("Active", membership.Status);
        Assert.NotNull(membership.ActivatedAt);
        Assert.NotNull(membership.EndDate);
        Assert.True(membership.EndDate > membership.ActivatedAt);
    }

    [Fact]
    public async Task UpdateMembership_UpdatesPaymentStatus_WhenProvided()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        context.Users.Add(CreateMember(1, "Alice", "Johnson"));
        context.UserTrainingMemberships.Add(new UserTrainingMembership
        {
            Id = 10,
            UserId = 1,
            TrainingType = "Group",
            Status = "Pending",
            PaymentStatus = "Pending",
            NutritionEnabled = false
        });
        await context.SaveChangesAsync();

        var dto = new UserTrainingMembershipUpdateDto { PaymentStatus = "Paid" };

        // Act
        var result = await controller.UpdateMembership(1, dto);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        var membership = await context.UserTrainingMemberships.SingleAsync(m => m.UserId == 1);
        Assert.Equal("Paid", membership.PaymentStatus);
        Assert.Equal("Pending", membership.Status);
    }

    [Fact]
    public async Task DeleteMember_RemovesMember_WhenExists()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        context.Users.Add(CreateMember(1, "Alice", "Johnson"));
        await context.SaveChangesAsync();

        // Act
        var result = await controller.DeleteMember(1);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.Null(await context.Users.FindAsync(1));
    }

    [Fact]
    public async Task DeleteMember_ReturnsNotFound_WhenMemberMissing()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        // Act
        var result = await controller.DeleteMember(999);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }
}
