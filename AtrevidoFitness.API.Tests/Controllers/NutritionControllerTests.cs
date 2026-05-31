using AtrevidoFitness.API.Controllers;
using AtrevidoFitness.API.Data;
using AtrevidoFitness.API.DTOs;
using AtrevidoFitness.API.Models.Entities;
using AtrevidoFitness.API.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AtrevidoFitness.API.Tests.Controllers;

public class NutritionControllerTests
{
    private static NutritionController CreateController(
        AppDbContext context,
        int userId,
        string role = "Member")
    {
        var controller = new NutritionController(context);
        var user = role == "Admin"
            ? TestUserFactory.CreateAdminUser(userId)
            : TestUserFactory.CreateMemberUser(userId);

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = TestUserFactory.CreateHttpContextWithUser(user)
        };

        return controller;
    }

    private static User CreateMember(int id, string firstName = "Alice")
    {
        return new User
        {
            Id = id,
            FirstName = firstName,
            LastName = "Johnson",
            Username = $"{firstName}.{id}".ToLowerInvariant(),
            Email = $"{firstName}.{id}@example.com".ToLowerInvariant(),
            PasswordHash = "hash",
            Role = "Member",
            IsActive = true
        };
    }

    private static UserTrainingMembership CreateMembership(
        int id,
        int userId,
        bool nutritionEnabled = true,
        string status = "Active")
    {
        return new UserTrainingMembership
        {
            Id = id,
            UserId = userId,
            TrainingType = "Individual",
            Status = status,
            PaymentStatus = "Paid",
            NutritionEnabled = nutritionEnabled,
            RequestedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            ActivatedAt = new DateTime(2026, 1, 2, 0, 0, 0, DateTimeKind.Utc)
        };
    }

    private static NutritionPlan CreatePlan(
        int id,
        int userId,
        string title = "Plan ishrane",
        bool isActive = true,
        string? pdfFileName = "plan.pdf",
        string? pdfBase64 = "base64-pdf")
    {
        return new NutritionPlan
        {
            Id = id,
            Title = title,
            PlanType = "FullPlan",
            IsActive = isActive,
            AssignedToUserId = userId,
            PdfFileName = pdfFileName,
            PdfBase64 = pdfBase64,
            PdfFileSize = pdfFileName == null ? null : "2.4 MB",
            PdfUploadedAt = pdfFileName == null
                ? null
                : new DateTime(2026, 1, 3, 0, 0, 0, DateTimeKind.Utc)
        };
    }

    private static object? GetProperty(object source, string propertyName)
    {
        return source.GetType().GetProperty(propertyName)?.GetValue(source);
    }

    [Fact]
    public async Task GetMembers_ReturnsNutritionMembersWithPlans()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, userId: 99, role: "Admin");

        context.Users.AddRange(
            CreateMember(1, "Alice"),
            CreateMember(2, "Beth"),
            CreateMember(3, "Cara"));
        context.UserTrainingMemberships.AddRange(
            CreateMembership(1, userId: 1),
            CreateMembership(2, userId: 2, nutritionEnabled: false),
            CreateMembership(3, userId: 3, status: "Pending"));
        context.NutritionPlans.Add(CreatePlan(1, userId: 1, title: "Alice plan"));
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetMembers();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var members = Assert.IsAssignableFrom<IEnumerable<object>>(okResult.Value).ToList();

        var member = Assert.Single(members);
        Assert.Equal(1, GetProperty(member, "Id"));
        Assert.Equal("Alice", GetProperty(member, "FirstName"));

        var plan = GetProperty(member, "NutritionPlan");
        Assert.NotNull(plan);
        var response = Assert.IsType<NutritionPlanResponseDto>(plan);
        Assert.Equal("Alice plan", response.Title);
        Assert.Equal("plan.pdf", response.PdfFileName);
    }

    [Fact]
    public async Task GetMine_ReturnsCurrentUsersPlan_WhenExists()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, userId: 1);

        context.Users.Add(CreateMember(1));
        context.UserTrainingMemberships.Add(CreateMembership(1, userId: 1));
        context.NutritionPlans.Add(CreatePlan(1, userId: 1, title: "My plan"));
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetMine();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var plan = Assert.IsType<NutritionPlanResponseDto>(okResult.Value);

        Assert.Equal(1, plan.Id);
        Assert.Equal("My plan", plan.Title);
        Assert.Equal(1, plan.AssignedToUserId);
    }

    [Fact]
    public async Task GetMine_ReturnsOkWithNull_WhenUserHasNoPlan()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, userId: 1);

        context.Users.Add(CreateMember(1));
        context.UserTrainingMemberships.Add(CreateMembership(1, userId: 1));
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetMine();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Null(okResult.Value);
    }

    [Fact]
    public async Task GetMine_ReturnsForbid_WhenUserHasNoActiveNutritionMembership()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, userId: 1);

        context.Users.Add(CreateMember(1));
        context.UserTrainingMemberships.Add(CreateMembership(1, userId: 1, nutritionEnabled: false));
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetMine();

        // Assert
        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task Download_ReturnsPdf_WhenPlanBelongsToUser()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, userId: 1);

        context.Users.Add(CreateMember(1));
        context.NutritionPlans.Add(CreatePlan(1, userId: 1, pdfFileName: "alice.pdf", pdfBase64: "abc123"));
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Download(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var pdf = Assert.IsType<NutritionPlanPdfDto>(okResult.Value);

        Assert.Equal("alice.pdf", pdf.PdfFileName);
        Assert.Equal("abc123", pdf.PdfBase64);
    }

    [Fact]
    public async Task Download_ReturnsNotFound_WhenPlanMissing()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, userId: 1);

        // Act
        var result = await controller.Download(999);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Download_ReturnsNotFound_WhenPdfMissing()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, userId: 1);

        context.Users.Add(CreateMember(1));
        context.NutritionPlans.Add(CreatePlan(1, userId: 1, pdfFileName: null, pdfBase64: null));
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Download(1);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task Download_ReturnsNotFound_WhenPlanBelongsToDifferentUser()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, userId: 1);

        context.Users.AddRange(CreateMember(1), CreateMember(2, "Beth"));
        context.NutritionPlans.Add(CreatePlan(1, userId: 2));
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Download(1);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task UploadPdf_CreatesNutritionPlan_WhenMemberHasActiveNutritionMembership()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, userId: 99, role: "Admin");

        context.Users.Add(CreateMember(1));
        context.UserTrainingMemberships.Add(CreateMembership(1, userId: 1));
        await context.SaveChangesAsync();

        var dto = new NutritionPlanPdfUploadDto
        {
            PdfFileName = "new-plan.pdf",
            PdfBase64 = "new-base64",
            PdfFileSize = "1.2 MB"
        };

        // Act
        var result = await controller.UploadPdf(1, dto);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        var plan = await context.NutritionPlans.SingleOrDefaultAsync(n => n.AssignedToUserId == 1);
        Assert.NotNull(plan);
        Assert.Equal("Plan ishrane", plan.Title);
        Assert.Equal("FullPlan", plan.PlanType);
        Assert.True(plan.IsActive);
        Assert.Equal("new-plan.pdf", plan.PdfFileName);
        Assert.Equal("new-base64", plan.PdfBase64);
        Assert.Equal("1.2 MB", plan.PdfFileSize);
        Assert.NotNull(plan.PdfUploadedAt);
    }

    [Fact]
    public async Task UploadPdf_UpdatesPdfFields_WhenPlanExists()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, userId: 99, role: "Admin");

        context.Users.Add(CreateMember(1));
        context.UserTrainingMemberships.Add(CreateMembership(1, userId: 1));
        context.NutritionPlans.Add(CreatePlan(1, userId: 1, pdfFileName: "old.pdf", pdfBase64: "old-base64"));
        await context.SaveChangesAsync();

        var dto = new NutritionPlanPdfUploadDto
        {
            PdfFileName = "updated.pdf",
            PdfBase64 = "updated-base64",
            PdfFileSize = "3 MB"
        };

        // Act
        var result = await controller.UploadPdf(1, dto);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        var plan = await context.NutritionPlans.SingleAsync(n => n.AssignedToUserId == 1);
        Assert.Equal("updated.pdf", plan.PdfFileName);
        Assert.Equal("updated-base64", plan.PdfBase64);
        Assert.Equal("3 MB", plan.PdfFileSize);
        Assert.NotNull(plan.PdfUploadedAt);
    }

    [Fact]
    public async Task UploadPdf_ReturnsBadRequest_WhenMemberHasNoActiveNutritionMembership()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, userId: 99, role: "Admin");

        context.Users.Add(CreateMember(1));
        context.UserTrainingMemberships.Add(CreateMembership(1, userId: 1, status: "Pending"));
        await context.SaveChangesAsync();

        var dto = new NutritionPlanPdfUploadDto
        {
            PdfFileName = "new-plan.pdf",
            PdfBase64 = "new-base64",
            PdfFileSize = "1.2 MB"
        };

        // Act
        var result = await controller.UploadPdf(1, dto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
        Assert.Empty(context.NutritionPlans);
    }

    [Fact]
    public async Task DeletePdf_RemovesNutritionPlan_WhenExists()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, userId: 99, role: "Admin");

        context.Users.Add(CreateMember(1));
        context.NutritionPlans.Add(CreatePlan(1, userId: 1));
        await context.SaveChangesAsync();

        // Act
        var result = await controller.DeletePdf(1);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        Assert.Empty(context.NutritionPlans);
    }

    [Fact]
    public async Task DeletePdf_ReturnsNotFound_WhenPlanMissing()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, userId: 99, role: "Admin");

        // Act
        var result = await controller.DeletePdf(999);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }
}
