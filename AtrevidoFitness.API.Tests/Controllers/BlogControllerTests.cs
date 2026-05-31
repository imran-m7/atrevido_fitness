using AtrevidoFitness.API.Controllers;
using AtrevidoFitness.API.Data;
using AtrevidoFitness.API.DTOs;
using AtrevidoFitness.API.Models.Entities;
using AtrevidoFitness.API.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AtrevidoFitness.API.Tests.Controllers;

public class BlogControllerTests
{
    private BlogController CreateController(AppDbContext context, int userId = 1, string role = "Member")
    {
        var controller = new BlogController(context);
        var user = role == "Admin" ? TestUserFactory.CreateAdminUser(userId) : TestUserFactory.CreateMemberUser(userId);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = TestUserFactory.CreateHttpContextWithUser(user)
        };
        return controller;
    }

    private void AddUserToContext(AppDbContext context, int userId)
    {
        if (!context.Users.Any(u => u.Id == userId))
        {
            var user = new User
            {
                Id = userId,
                Username = $"user{userId}",
                Email = $"user{userId}@test.com",
                PasswordHash = "hash",
                FirstName = "Test",
                LastName = "User",
                PhoneNumber = "1234567890"
            };
            context.Users.Add(user);
            context.SaveChanges();
        }
    }

    [Fact]
    public async Task GetAll_ReturnsPublishedBlogs()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        AddUserToContext(context, 1);
        
        var blog1 = new BlogPost
        {
            Title = "Published Blog 1",
            Content = "Content 1",
            Category = "Tech",
            IsPublished = true,
            PublishedAt = DateTime.UtcNow.AddDays(-5),
            AuthorId = 1
        };
        var blog2 = new BlogPost
        {
            Title = "Published Blog 2",
            Content = "Content 2",
            Category = "Health",
            IsPublished = true,
            PublishedAt = DateTime.UtcNow.AddDays(-2),
            AuthorId = 1
        };
        context.BlogPosts.Add(blog1);
        context.BlogPosts.Add(blog2);
        context.SaveChanges();

        var controller = CreateController(context);

        // Act
        var result = await controller.GetAll();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var blogs = Assert.IsType<List<BlogPostResponseDto>>(okResult.Value);
        Assert.Equal(2, blogs.Count);
        Assert.All(blogs, blog => Assert.True(blog.IsPublished));
    }

    [Fact]
    public async Task GetAll_DoesNotReturnUnpublishedBlogs_IfControllerFiltersThem()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        AddUserToContext(context, 1);
        
        var publishedBlog = new BlogPost
        {
            Title = "Published Blog",
            Content = "Published Content",
            Category = "Tech",
            IsPublished = true,
            PublishedAt = DateTime.UtcNow,
            AuthorId = 1
        };
        var unpublishedBlog = new BlogPost
        {
            Title = "Unpublished Blog",
            Content = "Unpublished Content",
            Category = "Tech",
            IsPublished = false,
            PublishedAt = null,
            AuthorId = 1
        };
        context.BlogPosts.Add(publishedBlog);
        context.BlogPosts.Add(unpublishedBlog);
        context.SaveChanges();

        var controller = CreateController(context);

        // Act
        var result = await controller.GetAll();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var blogs = Assert.IsType<List<BlogPostResponseDto>>(okResult.Value);
        Assert.Single(blogs);
        Assert.Equal("Published Blog", blogs.First().Title);
        Assert.True(blogs.First().IsPublished);
    }

    [Fact]
    public async Task GetById_ReturnsBlog_WhenBlogExists()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        AddUserToContext(context, 1);
        
        var blog = new BlogPost
        {
            Title = "Test Blog",
            Content = "Test Content",
            Category = "Fitness",
            IsPublished = true,
            PublishedAt = DateTime.UtcNow,
            AuthorId = 1
        };
        context.BlogPosts.Add(blog);
        context.SaveChanges();

        var controller = CreateController(context);

        // Act
        var result = await controller.GetById(blog.Id);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var returnedBlog = Assert.IsType<BlogPostResponseDto>(okResult.Value);
        Assert.Equal(blog.Id, returnedBlog.Id);
        Assert.Equal("Test Blog", returnedBlog.Title);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenBlogDoesNotExist()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context);

        // Act
        var result = await controller.GetById(999);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Create_AddsBlog_WhenValid()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        AddUserToContext(context, 1);
        
        var controller = CreateController(context, userId: 1, role: "Admin");

        var createDto = new BlogPostCreateDto
        {
            Title = "New Blog",
            Content = "New Content",
            Category = "Nutrition",
            IsPublished = true,
            ImageUrl = "https://example.com/image.jpg",
            ImageBase64 = null
        };

        // Act
        var result = await controller.Create(createDto);

        // Assert
        Assert.IsType<CreatedAtActionResult>(result);
        var createdResult = (CreatedAtActionResult)result;
        Assert.Equal(nameof(BlogController.GetById), createdResult.ActionName);

        var addedBlog = context.BlogPosts.FirstOrDefault(b => b.Title == "New Blog");
        Assert.NotNull(addedBlog);
        Assert.Equal("New Content", addedBlog.Content);
        Assert.Equal("Nutrition", addedBlog.Category);
        Assert.True(addedBlog.IsPublished);
        Assert.Equal(1, addedBlog.AuthorId);
        Assert.NotNull(addedBlog.PublishedAt);
    }

    [Fact]
    public async Task Update_ChangesBlog_WhenBlogExists()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        AddUserToContext(context, 1);
        
        var blog = new BlogPost
        {
            Title = "Original Title",
            Content = "Original Content",
            Category = "Tech",
            IsPublished = false,
            AuthorId = 1
        };
        context.BlogPosts.Add(blog);
        context.SaveChanges();

        var controller = CreateController(context, userId: 1, role: "Admin");

        var updateDto = new BlogPostUpdateDto
        {
            Title = "Updated Title",
            Content = "Updated Content",
            Category = "Fitness"
        };

        // Act
        var result = await controller.Update(blog.Id, updateDto);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        
        var updatedBlog = context.BlogPosts.FirstOrDefault(b => b.Id == blog.Id);
        Assert.NotNull(updatedBlog);
        Assert.Equal("Updated Title", updatedBlog.Title);
        Assert.Equal("Updated Content", updatedBlog.Content);
        Assert.Equal("Fitness", updatedBlog.Category);
    }

    [Fact]
    public async Task Update_ReturnsNotFound_WhenBlogDoesNotExist()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, userId: 1, role: "Admin");

        var updateDto = new BlogPostUpdateDto
        {
            Title = "Updated Title"
        };

        // Act
        var result = await controller.Update(999, updateDto);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Delete_RemovesBlog_WhenBlogExists()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        AddUserToContext(context, 1);
        
        var blog = new BlogPost
        {
            Title = "Blog to Delete",
            Content = "This blog will be deleted",
            Category = "Tech",
            IsPublished = true,
            AuthorId = 1
        };
        context.BlogPosts.Add(blog);
        context.SaveChanges();

        var blogId = blog.Id;
        var controller = CreateController(context, userId: 1, role: "Admin");

        // Act
        var result = await controller.Delete(blogId);

        // Assert
        Assert.IsType<NoContentResult>(result);
        
        var deletedBlog = context.BlogPosts.FirstOrDefault(b => b.Id == blogId);
        Assert.Null(deletedBlog);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenBlogDoesNotExist()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, userId: 1, role: "Admin");

        // Act
        var result = await controller.Delete(999);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }
}
