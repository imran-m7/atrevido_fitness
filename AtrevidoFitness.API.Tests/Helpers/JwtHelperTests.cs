using AtrevidoFitness.API.Helpers;
using AtrevidoFitness.API.Models.Entities;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace AtrevidoFitness.API.Tests.Helpers;

public class JwtHelperTests
{
    [Fact]
    public void GenerateToken_ReturnsValidToken()
    {
        var settings = new Dictionary<string, string?>
        {
            {"JwtSettings:SecretKey", "THIS_IS_A_VERY_LONG_SECRET_KEY_12345"},
            {"JwtSettings:Issuer", "TestIssuer"},
            {"JwtSettings:Audience", "TestAudience"}
        };

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(settings)
            .Build();

        var helper = new JwtHelper(configuration);

        var user = new User
        {
            Id = 1,
            Username = "testuser",
            Role = "Admin"
        };

        var token = helper.GenerateToken(user);

        Assert.NotNull(token);
        Assert.NotEmpty(token);
    }

    [Fact]
    public void GenerateToken_ContainsCorrectClaims()
    {
        var settings = new Dictionary<string, string?>
        {
            {"JwtSettings:SecretKey", "THIS_IS_A_VERY_LONG_SECRET_KEY_12345"},
            {"JwtSettings:Issuer", "TestIssuer"},
            {"JwtSettings:Audience", "TestAudience"}
        };

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(settings)
            .Build();

        var helper = new JwtHelper(configuration);

        var user = new User
        {
            Id = 5,
            Username = "memberuser",
            Role = "Member"
        };

        var token = helper.GenerateToken(user);

        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(token);

        Assert.Contains(jwt.Claims,
            c => c.Type == ClaimTypes.NameIdentifier && c.Value == "5");

        Assert.Contains(jwt.Claims,
            c => c.Type == ClaimTypes.Name && c.Value == "memberuser");

        Assert.Contains(jwt.Claims,
            c => c.Type == ClaimTypes.Role && c.Value == "Member");
    }
}