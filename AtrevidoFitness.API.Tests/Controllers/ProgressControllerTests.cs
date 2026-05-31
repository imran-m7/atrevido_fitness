using AtrevidoFitness.API.Controllers;
using AtrevidoFitness.API.Data;
using AtrevidoFitness.API.DTOs;
using AtrevidoFitness.API.Models.Entities;
using AtrevidoFitness.API.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace AtrevidoFitness.API.Tests.Controllers;

public class ProgressControllerTests
{
    private ProgressController CreateController(AppDbContext context, int userId, string role = "Member")
    {
        var controller = new ProgressController(context);
        var user = role == "Admin" ? TestUserFactory.CreateAdminUser(userId) : TestUserFactory.CreateMemberUser(userId);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = TestUserFactory.CreateHttpContextWithUser(user)
        };
        return controller;
    }
    [Fact]
    public async Task GetMine_ReturnsOnlyAuthenticatedUsersProgress()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        // Create two users
        var user1 = new User { Id = 1, FirstName = "John", LastName = "Doe", Username = "john_doe", PasswordHash = "hash1", Role = "Member" };
        var user2 = new User { Id = 2, FirstName = "Jane", LastName = "Smith", Username = "jane_smith", PasswordHash = "hash2", Role = "Member" };
        context.Users.AddRange(user1, user2);
        await context.SaveChangesAsync();

        // Create progress entries for both users
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var entry1 = new ProgressEntry { Id = 1, UserId = 1, EntryDate = today, WeightKg = 80m, Notes = "Entry for user 1" };
        var entry2 = new ProgressEntry { Id = 2, UserId = 1, EntryDate = today.AddDays(-1), WeightKg = 81m, Notes = "Another entry for user 1" };
        var entry3 = new ProgressEntry { Id = 3, UserId = 2, EntryDate = today, WeightKg = 70m, Notes = "Entry for user 2" };
        context.ProgressEntries.AddRange(entry1, entry2, entry3);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetMine();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var entries = Assert.IsType<List<ProgressEntryResponseDto>>(okResult.Value);
        
        Assert.Equal(2, entries.Count);
        Assert.All(entries, e => Assert.Equal(1, e.UserId));
        Assert.Contains(entries, e => e.Id == 1);
        Assert.Contains(entries, e => e.Id == 2);
        Assert.DoesNotContain(entries, e => e.Id == 3);
    }

    [Fact]
    public async Task GetMine_ReturnsEmptyList_WhenUserHasNoEntries()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        var user = new User { Id = 1, FirstName = "John", LastName = "Doe", Username = "john_doe", PasswordHash = "hash1", Role = "Member" };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetMine();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var entries = Assert.IsType<List<ProgressEntryResponseDto>>(okResult.Value);
        Assert.Empty(entries);
    }

    [Fact]
    public async Task Add_CreatesProgressEntry_ForAuthenticatedUser()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        var user = new User { Id = 1, FirstName = "John", LastName = "Doe", Username = "john_doe", PasswordHash = "hash1", Role = "Member" };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var dto = new ProgressEntryCreateDto
        {
            EntryDate = today,
            WeightKg = 75.5m,
            HeightCm = 180m,
            WaistCm = 85m,
            ArmCm = 30m,
            ThighCm = 55m,
            Notes = "Test entry"
        };

        // Act
        var result = await controller.Add(dto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var responseDto = Assert.IsType<ProgressEntryResponseDto>(okResult.Value);
        
        Assert.NotEqual(0, responseDto.Id);
        Assert.Equal(1, responseDto.UserId);
        Assert.Equal(today, responseDto.EntryDate);
        Assert.Equal(75.5m, responseDto.WeightKg);
        Assert.Equal("Test entry", responseDto.Notes);

        // Verify it was saved to database
        var savedEntry = await context.ProgressEntries.FindAsync(responseDto.Id);
        Assert.NotNull(savedEntry);
        Assert.Equal(1, savedEntry.UserId);
    }

    [Fact]
    public async Task Update_UpdatesOnlyOwnProgressEntry()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        var user = new User { Id = 1, FirstName = "John", LastName = "Doe", Username = "john_doe", PasswordHash = "hash1", Role = "Member" };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var entry = new ProgressEntry { Id = 1, UserId = 1, EntryDate = today, WeightKg = 80m, ArmCm = 30m };
        context.ProgressEntries.Add(entry);
        await context.SaveChangesAsync();

        var updateDto = new ProgressEntryUpdateDto
        {
            WeightKg = 77m,
            ArmCm = 29m,
            Notes = "Updated"
        };

        // Act
        var result = await controller.Update(1, updateDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var responseDto = Assert.IsType<ProgressEntryResponseDto>(okResult.Value);
        
        Assert.Equal(77m, responseDto.WeightKg);
        Assert.Equal(29m, responseDto.ArmCm);
        Assert.Equal("Updated", responseDto.Notes);

        // Verify in database
        var dbEntry = await context.ProgressEntries.FindAsync(1);
        Assert.Equal(77m, dbEntry!.WeightKg);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenEntryBelongsToOtherUser()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        var user1 = new User { Id = 1, FirstName = "John", LastName = "Doe", Username = "john_doe", PasswordHash = "hash1", Role = "Member" };
        var user2 = new User { Id = 2, FirstName = "Jane", LastName = "Smith", Username = "jane_smith", PasswordHash = "hash2", Role = "Member" };
        context.Users.AddRange(user1, user2);
        await context.SaveChangesAsync();

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var entry = new ProgressEntry { Id = 1, UserId = 2, EntryDate = today, WeightKg = 80m };
        context.ProgressEntries.Add(entry);
        await context.SaveChangesAsync();

        var updateDto = new ProgressEntryUpdateDto { WeightKg = 77m };

        // Act
        var result = await controller.Update(1, updateDto);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task GetByUser_Admin_ReturnsSelectedUsersProgress()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1, "Admin");

        var admin = new User { Id = 1, FirstName = "Admin", LastName = "User", Username = "admin", PasswordHash = "hash", Role = "Admin" };
        var user2 = new User { Id = 2, FirstName = "John", LastName = "Doe", Username = "john_doe", PasswordHash = "hash1", Role = "Member" };
        var user3 = new User { Id = 3, FirstName = "Jane", LastName = "Smith", Username = "jane_smith", PasswordHash = "hash2", Role = "Member" };
        context.Users.AddRange(admin, user2, user3);
        await context.SaveChangesAsync();

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var entry1 = new ProgressEntry { Id = 1, UserId = 2, EntryDate = today, WeightKg = 80m };
        var entry2 = new ProgressEntry { Id = 2, UserId = 2, EntryDate = today.AddDays(-1), WeightKg = 81m };
        var entry3 = new ProgressEntry { Id = 3, UserId = 3, EntryDate = today, WeightKg = 70m };
        context.ProgressEntries.AddRange(entry1, entry2, entry3);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetByUser(2);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var entries = Assert.IsType<List<ProgressEntryResponseDto>>(okResult.Value);
        
        Assert.Equal(2, entries.Count);
        Assert.All(entries, e => Assert.Equal(2, e.UserId));
        Assert.Contains(entries, e => e.Id == 1);
        Assert.Contains(entries, e => e.Id == 2);
    }
}
