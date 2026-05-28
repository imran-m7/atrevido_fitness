using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace AtrevidoFitness.API.Tests.Helpers;

public static class TestUserFactory
{
    /// <summary>
    /// Creates a ClaimsPrincipal for a regular Member user.
    /// </summary>
    /// <param name="userId">The user ID to use in the NameIdentifier claim</param>
    /// <returns>A ClaimsPrincipal with NameIdentifier and Role=Member</returns>
    public static ClaimsPrincipal CreateMemberUser(int userId)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Role, "Member")
        };

        var identity = new ClaimsIdentity(claims, "TestAuthentication");
        return new ClaimsPrincipal(identity);
    }

    /// <summary>
    /// Creates a ClaimsPrincipal for an Admin user.
    /// </summary>
    /// <param name="userId">The user ID to use in the NameIdentifier claim</param>
    /// <returns>A ClaimsPrincipal with NameIdentifier and Role=Admin</returns>
    public static ClaimsPrincipal CreateAdminUser(int userId)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Role, "Admin")
        };

        var identity = new ClaimsIdentity(claims, "TestAuthentication");
        return new ClaimsPrincipal(identity);
    }

    /// <summary>
    /// Creates a mock HttpContext with the specified user.
    /// </summary>
    public static HttpContext CreateHttpContextWithUser(ClaimsPrincipal user)
    {
        var httpContext = new DefaultHttpContext();
        httpContext.User = user;
        return httpContext;
    }
}
