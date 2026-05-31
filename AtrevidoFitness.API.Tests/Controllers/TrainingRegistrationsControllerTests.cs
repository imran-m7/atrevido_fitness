using AtrevidoFitness.API.Controllers;
using AtrevidoFitness.API.Data;
using AtrevidoFitness.API.DTOs;
using AtrevidoFitness.API.Models.Entities;
using AtrevidoFitness.API.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AtrevidoFitness.API.Tests.Controllers;

public class TrainingRegistrationsControllerTests
{
    private TrainingRegistrationsController CreateController(AppDbContext context, int userId, string role = "Member")
    {
        var controller = new TrainingRegistrationsController(context);
        var user = role == "Admin" ? TestUserFactory.CreateAdminUser(userId) : TestUserFactory.CreateMemberUser(userId);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = TestUserFactory.CreateHttpContextWithUser(user)
        };
        return controller;
    }

    [Fact]
    public async Task Register_AddsRegistration_WhenValid()
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
            PaymentStatus = "Paid"
        };

        var session = new TrainingSession
        {
            Id = 1,
            Type = "Cardio",
            DayOfWeek = "Monday",
            StartTime = new TimeSpan(10, 0, 0),
            EndTime = new TimeSpan(11, 0, 0),
            GroupName = "Cardio Class",
            MaxCapacity = 20,
            MinCapacity = 5,
            IsActive = true
        };

        context.Users.Add(user);
        context.UserTrainingMemberships.Add(membership);
        context.TrainingSessions.Add(session);
        await context.SaveChangesAsync();

        var registerDto = new TrainingRegistrationCreateDto
        {
            TrainingSessionId = 1,
            SessionDate = DateOnly.FromDateTime(DateTime.Today)
        };

        // Act
        var result = await controller.Register(registerDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        
        var registration = await context.TrainingRegistrations
            .FirstOrDefaultAsync(r => r.UserId == 1 && r.TrainingSessionId == 1);
        Assert.NotNull(registration);
        Assert.Equal("Registered", registration.Status);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenAlreadyRegisteredForSession()
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
            PaymentStatus = "Paid"
        };

        var session = new TrainingSession
        {
            Id = 1,
            Type = "Cardio",
            DayOfWeek = "Monday",
            StartTime = new TimeSpan(10, 0, 0),
            EndTime = new TimeSpan(11, 0, 0),
            GroupName = "Cardio Class",
            MaxCapacity = 20,
            MinCapacity = 5,
            IsActive = true
        };

        var existingRegistration = new TrainingRegistration
        {
            Id = 1,
            UserId = 1,
            TrainingSessionId = 1,
            SessionDate = DateOnly.FromDateTime(DateTime.Today),
            Status = "Registered"
        };

        context.Users.Add(user);
        context.UserTrainingMemberships.Add(membership);
        context.TrainingSessions.Add(session);
        context.TrainingRegistrations.Add(existingRegistration);
        await context.SaveChangesAsync();

        var registerDto = new TrainingRegistrationCreateDto
        {
            TrainingSessionId = 1,
            SessionDate = DateOnly.FromDateTime(DateTime.Today)
        };

        // Act
        var result = await controller.Register(registerDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Register_ReturnsNotFound_WhenSessionDoesNotExist()
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
            PaymentStatus = "Paid"
        };

        context.Users.Add(user);
        context.UserTrainingMemberships.Add(membership);
        await context.SaveChangesAsync();

        var registerDto = new TrainingRegistrationCreateDto
        {
            TrainingSessionId = 999, // Non-existent session
            SessionDate = DateOnly.FromDateTime(DateTime.Today)
        };

        // Act
        var result = await controller.Register(registerDto);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Register_ReturnsForbid_WhenUserHasNoActiveMembership()
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

        var session = new TrainingSession
        {
            Id = 1,
            Type = "Cardio",
            DayOfWeek = "Monday",
            StartTime = new TimeSpan(10, 0, 0),
            EndTime = new TimeSpan(11, 0, 0),
            GroupName = "Cardio Class",
            MaxCapacity = 20,
            MinCapacity = 5,
            IsActive = true
        };

        context.Users.Add(user);
        context.TrainingSessions.Add(session);
        await context.SaveChangesAsync();
        // User has no membership

        var registerDto = new TrainingRegistrationCreateDto
        {
            TrainingSessionId = 1,
            SessionDate = DateOnly.FromDateTime(DateTime.Today)
        };

        // Act
        var result = await controller.Register(registerDto);

        // Assert
        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenSessionIsFull()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 2);

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

        var membership = new UserTrainingMembership
        {
            Id = 1,
            UserId = 2,
            TrainingType = "Group",
            Status = "Active",
            PaymentStatus = "Paid"
        };

        var session = new TrainingSession
        {
            Id = 1,
            Type = "Cardio",
            DayOfWeek = "Monday",
            StartTime = new TimeSpan(10, 0, 0),
            EndTime = new TimeSpan(11, 0, 0),
            GroupName = "Cardio Class",
            MaxCapacity = 1, // Only 1 spot
            MinCapacity = 1,
            IsActive = true
        };

        // User 1 already registered
        var existingReg = new TrainingRegistration
        {
            Id = 1,
            UserId = 1,
            TrainingSessionId = 1,
            SessionDate = DateOnly.FromDateTime(DateTime.Today),
            Status = "Registered"
        };

        context.Users.AddRange(user1, user2);
        context.UserTrainingMemberships.Add(membership);
        context.TrainingSessions.Add(session);
        context.TrainingRegistrations.Add(existingReg);
        await context.SaveChangesAsync();

        var registerDto = new TrainingRegistrationCreateDto
        {
            TrainingSessionId = 1,
            SessionDate = DateOnly.FromDateTime(DateTime.Today)
        };

        // Act
        var result = await controller.Register(registerDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenUserAlreadyHasAnotherSessionThatDay()
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
            PaymentStatus = "Paid"
        };

        var session1 = new TrainingSession
        {
            Id = 1,
            Type = "Cardio",
            DayOfWeek = "Monday",
            StartTime = new TimeSpan(10, 0, 0),
            EndTime = new TimeSpan(11, 0, 0),
            GroupName = "Morning Cardio",
            MaxCapacity = 20,
            MinCapacity = 5,
            IsActive = true
        };

        var session2 = new TrainingSession
        {
            Id = 2,
            Type = "Strength",
            DayOfWeek = "Monday",
            StartTime = new TimeSpan(16, 0, 0),
            EndTime = new TimeSpan(17, 0, 0),
            GroupName = "Evening Strength",
            MaxCapacity = 20,
            MinCapacity = 5,
            IsActive = true
        };

        // User already registered for session 1 today
        var existingReg = new TrainingRegistration
        {
            Id = 1,
            UserId = 1,
            TrainingSessionId = 1,
            SessionDate = DateOnly.FromDateTime(DateTime.Today),
            Status = "Registered"
        };

        context.Users.Add(user);
        context.UserTrainingMemberships.Add(membership);
        context.TrainingSessions.AddRange(session1, session2);
        context.TrainingRegistrations.Add(existingReg);
        await context.SaveChangesAsync();

        var registerDto = new TrainingRegistrationCreateDto
        {
            TrainingSessionId = 2, // Different session, same day
            SessionDate = DateOnly.FromDateTime(DateTime.Today)
        };

        // Act
        var result = await controller.Register(registerDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Register_AllowsSameSessionOnDifferentDates()
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
            PaymentStatus = "Paid"
        };

        var session = new TrainingSession
        {
            Id = 1,
            Type = "Cardio",
            DayOfWeek = "Monday",
            StartTime = new TimeSpan(10, 0, 0),
            EndTime = new TimeSpan(11, 0, 0),
            GroupName = "Cardio Class",
            MaxCapacity = 20,
            MinCapacity = 5,
            IsActive = true
        };

        // User already registered for this session on a different date
        var existingReg = new TrainingRegistration
        {
            Id = 1,
            UserId = 1,
            TrainingSessionId = 1,
            SessionDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-7)),
            Status = "Registered"
        };

        context.Users.Add(user);
        context.UserTrainingMemberships.Add(membership);
        context.TrainingSessions.Add(session);
        context.TrainingRegistrations.Add(existingReg);
        await context.SaveChangesAsync();

        var registerDto = new TrainingRegistrationCreateDto
        {
            TrainingSessionId = 1,
            SessionDate = DateOnly.FromDateTime(DateTime.Today) // Different date
        };

        // Act
        var result = await controller.Register(registerDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetMine_ReturnsOnlyCurrentUsersRegistrations()
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

        var session = new TrainingSession
        {
            Id = 1,
            Type = "Cardio",
            DayOfWeek = "Monday",
            StartTime = new TimeSpan(10, 0, 0),
            EndTime = new TimeSpan(11, 0, 0),
            GroupName = "Cardio Class",
            MaxCapacity = 20,
            MinCapacity = 5,
            IsActive = true
        };

        var reg1 = new TrainingRegistration
        {
            Id = 1,
            UserId = 1,
            TrainingSessionId = 1,
            SessionDate = DateOnly.FromDateTime(DateTime.Today),
            Status = "Registered"
        };

        var reg2 = new TrainingRegistration
        {
            Id = 2,
            UserId = 2, // Different user
            TrainingSessionId = 1,
            SessionDate = DateOnly.FromDateTime(DateTime.Today),
            Status = "Registered"
        };

        context.Users.AddRange(user1, user2);
        context.TrainingSessions.Add(session);
        context.TrainingRegistrations.AddRange(reg1, reg2);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetMine();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var registrations = Assert.IsType<List<TrainingRegistrationResponseDto>>(okResult.Value);

        Assert.Single(registrations);
        Assert.Equal(1, registrations[0].UserId);
    }

    [Fact]
    public async Task GetMine_ReturnsEmptyList_WhenUserHasNoRegistrations()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        // Act
        var result = await controller.GetMine();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var registrations = Assert.IsType<List<TrainingRegistrationResponseDto>>(okResult.Value);
        Assert.Empty(registrations);
    }

    [Fact]
    public async Task Cancel_MarksRegistrationAsCancelled_WhenValid()
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

        var session = new TrainingSession
        {
            Id = 1,
            Type = "Cardio",
            DayOfWeek = "Monday",
            StartTime = new TimeSpan(10, 0, 0),
            EndTime = new TimeSpan(11, 0, 0),
            GroupName = "Cardio Class",
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
            Status = "Registered"
        };

        context.Users.Add(user);
        context.TrainingSessions.Add(session);
        context.TrainingRegistrations.Add(registration);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Cancel(1);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        
        var cancelledReg = await context.TrainingRegistrations.FindAsync(1);
        Assert.NotNull(cancelledReg);
        Assert.Equal("Cancelled", cancelledReg.Status);
    }

    [Fact]
    public async Task Cancel_ReturnsNotFound_WhenRegistrationDoesNotExist()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        // Act
        var result = await controller.Cancel(999);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Cancel_ReturnsNotFound_WhenRegistrationBelongsToAnotherUser()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1); // User 1 is authenticated

        var user2 = new User
        {
            Id = 2,
            FirstName = "Jane",
            LastName = "Smith",
            Username = "janesmith",
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
            GroupName = "Cardio Class",
            MaxCapacity = 20,
            MinCapacity = 5,
            IsActive = true
        };

        var registration = new TrainingRegistration
        {
            Id = 1,
            UserId = 2, // Belongs to user 2, not user 1
            TrainingSessionId = 1,
            SessionDate = DateOnly.FromDateTime(DateTime.Today),
            Status = "Registered"
        };

        context.Users.Add(user2);
        context.TrainingSessions.Add(session);
        context.TrainingRegistrations.Add(registration);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Cancel(1);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }
}
