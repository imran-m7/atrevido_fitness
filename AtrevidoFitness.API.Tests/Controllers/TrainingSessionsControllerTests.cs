using AtrevidoFitness.API.Controllers;
using AtrevidoFitness.API.Data;
using AtrevidoFitness.API.DTOs;
using AtrevidoFitness.API.Models.Entities;
using AtrevidoFitness.API.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AtrevidoFitness.API.Tests.Controllers;

public class TrainingSessionsControllerTests
{
    private TrainingSessionsController CreateController(AppDbContext context, int? userId = null, string role = "Member")
    {
        var controller = new TrainingSessionsController(context);
        if (userId.HasValue)
        {
            var user = role == "Admin" ? TestUserFactory.CreateAdminUser(userId.Value) : TestUserFactory.CreateMemberUser(userId.Value);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = TestUserFactory.CreateHttpContextWithUser(user)
            };
        }
        return controller;
    }

    [Fact]
    public async Task GetAll_ReturnsOnlyActiveSessions()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        var activeSession = new TrainingSession
        {
            Id = 1,
            Type = "Cardio",
            DayOfWeek = "Monday",
            StartTime = new TimeSpan(10, 0, 0),
            EndTime = new TimeSpan(11, 0, 0),
            GroupName = "Active Group",
            MaxCapacity = 20,
            MinCapacity = 5,
            IsActive = true,
            Location = "Gym A",
            Notes = "Active session"
        };

        var inactiveSession = new TrainingSession
        {
            Id = 2,
            Type = "Strength",
            DayOfWeek = "Tuesday",
            StartTime = new TimeSpan(14, 0, 0),
            EndTime = new TimeSpan(15, 0, 0),
            GroupName = "Inactive Group",
            MaxCapacity = 15,
            MinCapacity = 3,
            IsActive = false,
            Location = "Gym B",
            Notes = "Inactive session"
        };

        context.TrainingSessions.AddRange(activeSession, inactiveSession);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetAll();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var sessions = ((IEnumerable<TrainingSessionResponseDto>)okResult.Value!).ToList();

        Assert.Single(sessions);
        Assert.Equal("Active Group", sessions[0].GroupName);
        Assert.True(sessions[0].IsActive);
    }

    [Fact]
    public async Task GetAll_ReturnsEmptyList_WhenNoActiveSessions()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        // Act
        var result = await controller.GetAll();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var sessions = ((IEnumerable<TrainingSessionResponseDto>)okResult.Value!).ToList();
        Assert.Empty(sessions);
    }

    [Fact]
    public async Task GetAll_IncludesRegistrationDetails()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        var session = new TrainingSession
        {
            Id = 1,
            Type = "Cardio",
            DayOfWeek = "Monday",
            StartTime = new TimeSpan(10, 0, 0),
            EndTime = new TimeSpan(11, 0, 0),
            GroupName = "Test Group",
            MaxCapacity = 20,
            MinCapacity = 5,
            IsActive = true,
            Location = "Gym A"
        };

        var user = new User
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            PasswordHash = "hash",
            Role = "Member"
        };

        var registration = new TrainingRegistration
        {
            Id = 1,
            UserId = 1,
            TrainingSessionId = 1,
            SessionDate = DateOnly.FromDateTime(DateTime.Today),
            Status = "Registered",
            User = user
        };

        context.Users.Add(user);
        context.TrainingSessions.Add(session);
        context.TrainingRegistrations.Add(registration);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetAll();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var sessions = ((IEnumerable<TrainingSessionResponseDto>)okResult.Value!).ToList();

        Assert.Single(sessions);
        Assert.Single(sessions[0].Registrations);
        Assert.Equal("John", sessions[0].Registrations[0].UserFirstName);
    }

    [Fact]
    public async Task Create_AddsNewSession_WhenAdmin()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1, "Admin");

        var createDto = new TrainingSessionCreateDto
        {
            Type = "Yoga",
            DayOfWeek = "Wednesday",
            StartTime = new TimeSpan(09, 0, 0),
            EndTime = new TimeSpan(10, 0, 0),
            GroupName = "Morning Yoga",
            MaxCapacity = 30,
            MinCapacity = 5,
            IsActive = true,
            Location = "Studio A",
            Notes = "Relaxing yoga session"
        };

        // Act
        var result = await controller.Create(createDto);

        // Assert
        Assert.IsType<CreatedAtActionResult>(result);
        
        var createdSession = await context.TrainingSessions.FirstOrDefaultAsync(s => s.GroupName == "Morning Yoga");
        Assert.NotNull(createdSession);
        Assert.Equal("Yoga", createdSession.Type);
        Assert.Equal("Wednesday", createdSession.DayOfWeek);
        Assert.True(createdSession.IsActive);
    }

    [Fact]
    public async Task Create_SavesSessionToDatabase()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1, "Admin");

        var createDto = new TrainingSessionCreateDto
        {
            Type = "Pilates",
            DayOfWeek = "Thursday",
            StartTime = new TimeSpan(16, 0, 0),
            EndTime = new TimeSpan(17, 0, 0),
            GroupName = "Evening Pilates",
            MaxCapacity = 25,
            MinCapacity = 4,
            IsActive = true,
            Location = "Studio B"
        };

        // Act
        await controller.Create(createDto);

        // Assert
        var sessionCount = await context.TrainingSessions.CountAsync();
        Assert.Equal(1, sessionCount);
        
        var session = await context.TrainingSessions.FirstAsync();
        Assert.Equal("Pilates", session.Type);
        Assert.Equal(25, session.MaxCapacity);
    }

    [Fact]
    public async Task Update_ModifiesSessionData_WhenExists()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1, "Admin");

        var session = new TrainingSession
        {
            Id = 1,
            Type = "Cardio",
            DayOfWeek = "Monday",
            StartTime = new TimeSpan(10, 0, 0),
            EndTime = new TimeSpan(11, 0, 0),
            GroupName = "Old Group Name",
            MaxCapacity = 20,
            MinCapacity = 5,
            IsActive = true,
            Location = "Gym A"
        };
        context.TrainingSessions.Add(session);
        await context.SaveChangesAsync();

        var updateDto = new TrainingSessionUpdateDto
        {
            GroupName = "New Group Name",
            MaxCapacity = 25,
            MinCapacity = 3
        };

        // Act
        var result = await controller.Update(1, updateDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        
        var updatedSession = await context.TrainingSessions.FindAsync(1);
        Assert.NotNull(updatedSession);
        Assert.Equal("New Group Name", updatedSession.GroupName);
        Assert.Equal(25, updatedSession.MaxCapacity);
        Assert.Equal(3, updatedSession.MinCapacity);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenSessionDoesNotExist()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1, "Admin");

        var updateDto = new TrainingSessionUpdateDto
        {
            GroupName = "New Name"
        };

        // Act
        var result = await controller.Update(999, updateDto);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Update_DeletesRegistrations_WhenScheduleChanges()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1, "Admin");

        var user = new User
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            PasswordHash = "hash",
            Role = "Member"
        };

        var session = new TrainingSession
        {
            Id = 1,
            Type = "Cardio",
            DayOfWeek = "Monday",
            StartTime = new TimeSpan(10, 0, 0),
            EndTime = new TimeSpan(11, 0, 0),
            GroupName = "Cardio Group",
            MaxCapacity = 20,
            MinCapacity = 5,
            IsActive = true
        };

        var registration = new TrainingRegistration
        {
            Id = 1,
            UserId = 1,
            TrainingSessionId = 1,
            SessionDate = DateOnly.FromDateTime(DateTime.Today),
            Status = "Registered",
            User = user
        };

        context.Users.Add(user);
        context.TrainingSessions.Add(session);
        context.TrainingRegistrations.Add(registration);
        await context.SaveChangesAsync();

        // Change the day - this should trigger schedule change
        var updateDto = new TrainingSessionUpdateDto
        {
            DayOfWeek = "Tuesday" // Schedule changed
        };

        // Act
        var result = await controller.Update(1, updateDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        
        var registrations = await context.TrainingRegistrations.ToListAsync();
        Assert.Empty(registrations); // All registrations should be deleted
    }

    [Fact]
    public async Task Delete_RemovesSession_WhenExists()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1, "Admin");

        var session = new TrainingSession
        {
            Id = 1,
            Type = "Cardio",
            DayOfWeek = "Monday",
            StartTime = new TimeSpan(10, 0, 0),
            EndTime = new TimeSpan(11, 0, 0),
            GroupName = "Test Group",
            MaxCapacity = 20,
            MinCapacity = 5,
            IsActive = true
        };
        context.TrainingSessions.Add(session);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Delete(1);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        
        var deletedSession = await context.TrainingSessions.FindAsync(1);
        Assert.Null(deletedSession);
    }

    [Fact]
    public async Task Delete_RemovesAllRegistrations_WhenSessionDeleted()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1, "Admin");

        var user = new User
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Username = "johndoe",
            PasswordHash = "hash",
            Role = "Member"
        };

        var session = new TrainingSession
        {
            Id = 1,
            Type = "Cardio",
            DayOfWeek = "Monday",
            StartTime = new TimeSpan(10, 0, 0),
            EndTime = new TimeSpan(11, 0, 0),
            GroupName = "Test Group",
            MaxCapacity = 20,
            MinCapacity = 5,
            IsActive = true
        };

        var registration1 = new TrainingRegistration
        {
            Id = 1,
            UserId = 1,
            TrainingSessionId = 1,
            SessionDate = DateOnly.FromDateTime(DateTime.Today),
            Status = "Registered",
            User = user
        };

        var registration2 = new TrainingRegistration
        {
            Id = 2,
            UserId = 1,
            TrainingSessionId = 1,
            SessionDate = DateOnly.FromDateTime(DateTime.Today.AddDays(7)),
            Status = "Registered",
            User = user
        };

        context.Users.Add(user);
        context.TrainingSessions.Add(session);
        context.TrainingRegistrations.AddRange(registration1, registration2);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Delete(1);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        
        var registrations = await context.TrainingRegistrations.ToListAsync();
        Assert.Empty(registrations);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenSessionDoesNotExist()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1, "Admin");

        // Act
        var result = await controller.Delete(999);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task GetAll_FiltersOutCancelledRegistrations()
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
            PasswordHash = "hash",
            Role = "Member"
        };

        var session = new TrainingSession
        {
            Id = 1,
            Type = "Cardio",
            DayOfWeek = "Monday",
            StartTime = new TimeSpan(10, 0, 0),
            EndTime = new TimeSpan(11, 0, 0),
            GroupName = "Test Group",
            MaxCapacity = 20,
            MinCapacity = 5,
            IsActive = true
        };

        var registeredReg = new TrainingRegistration
        {
            Id = 1,
            UserId = 1,
            TrainingSessionId = 1,
            SessionDate = DateOnly.FromDateTime(DateTime.Today),
            Status = "Registered",
            User = user
        };

        var cancelledReg = new TrainingRegistration
        {
            Id = 2,
            UserId = 1,
            TrainingSessionId = 1,
            SessionDate = DateOnly.FromDateTime(DateTime.Today),
            Status = "Cancelled",
            User = user
        };

        context.Users.Add(user);
        context.TrainingSessions.Add(session);
        context.TrainingRegistrations.AddRange(registeredReg, cancelledReg);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetAll();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var sessions = ((IEnumerable<TrainingSessionResponseDto>)okResult.Value!).ToList();

        Assert.Single(sessions);
        Assert.Single(sessions[0].Registrations); // Only the registered one
        Assert.Equal("Registered", sessions[0].Registrations[0].Status);
    }
}
