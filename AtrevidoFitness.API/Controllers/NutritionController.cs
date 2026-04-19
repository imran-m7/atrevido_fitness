using AtrevidoFitness.API.Data;
using AtrevidoFitness.API.DTOs;
using AtrevidoFitness.API.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AtrevidoFitness.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NutritionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NutritionController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/nutrition — clanica vidi svoje planove
        [HttpGet]
        public async Task<IActionResult> GetMine()
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // Provjeri tip clanstva
            var membership = await _context.UserTrainingMemberships
                .FirstOrDefaultAsync(m => m.UserId == userId
                    && m.Status == "Active");

            if (membership == null)
                return Forbid();

            // Grupne clanice vide samo Guidelines
            // Individualne vide sve ako imaju NutritionEnabled
            var planType = membership.TrainingType == "Individual"
                && membership.NutritionEnabled
                ? "FullPlan"
                : "Guidelines";

            var plans = await _context.NutritionPlans
                .Where(n => n.IsActive
                    && n.PlanType == planType
                    && (n.AssignedToUserId == null
                        || n.AssignedToUserId == userId))
                .Include(n => n.Recipes)
                .Select(n => new NutritionPlanResponseDto
                {
                    Id = n.Id,
                    Title = n.Title,
                    Content = n.Content,
                    PlanType = n.PlanType,
                    IsActive = n.IsActive,
                    CreatedAt = n.CreatedAt,
                    AssignedToUserId = n.AssignedToUserId
                })
                .ToListAsync();

            return Ok(plans);
        }

        // POST api/nutrition — samo Admin
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(
            [FromBody] NutritionPlanCreateDto dto)
        {
            var plan = new NutritionPlan
            {
                Title = dto.Title,
                Content = dto.Content,
                PlanType = dto.PlanType,
                IsActive = dto.IsActive,
                AssignedToUserId = dto.AssignedToUserId
            };

            _context.NutritionPlans.Add(plan);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Nutrition plan created.", id = plan.Id });
        }

        // PUT api/nutrition/{id} — samo Admin
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id,
            [FromBody] NutritionPlanUpdateDto dto)
        {
            var plan = await _context.NutritionPlans.FindAsync(id);
            if (plan == null) return NotFound();

            if (dto.Title != null) plan.Title = dto.Title;
            if (dto.Content != null) plan.Content = dto.Content;
            if (dto.PlanType != null) plan.PlanType = dto.PlanType;
            if (dto.IsActive.HasValue) plan.IsActive = dto.IsActive.Value;
            if (dto.AssignedToUserId.HasValue)
                plan.AssignedToUserId = dto.AssignedToUserId;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Plan updated." });
        }

        // POST api/nutrition/{planId}/recipes — Admin dodaje recept
        [HttpPost("{planId}/recipes")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddRecipe(int planId,
            [FromBody] NutritionRecipeCreateDto dto)
        {
            var plan = await _context.NutritionPlans.FindAsync(planId);
            if (plan == null) return NotFound();

            var recipe = new NutritionRecipe
            {
                NutritionPlanId = planId,
                Title = dto.Title,
                Ingredients = dto.Ingredients,
                Instructions = dto.Instructions,
                ImageUrl = dto.ImageUrl,
                CaloriesPerServing = dto.CaloriesPerServing
            };

            _context.NutritionRecipes.Add(recipe);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Recipe added.", id = recipe.Id });
        }

        // PUT api/nutrition/recipes/{id} — Admin
        [HttpPut("recipes/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRecipe(int id,
            [FromBody] NutritionRecipeUpdateDto dto)
        {
            var recipe = await _context.NutritionRecipes.FindAsync(id);
            if (recipe == null) return NotFound();

            if (dto.Title != null) recipe.Title = dto.Title;
            if (dto.Ingredients != null) recipe.Ingredients = dto.Ingredients;
            if (dto.Instructions != null) recipe.Instructions = dto.Instructions;
            if (dto.ImageUrl != null) recipe.ImageUrl = dto.ImageUrl;
            if (dto.CaloriesPerServing.HasValue)
                recipe.CaloriesPerServing = dto.CaloriesPerServing;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Recipe updated." });
        }
    }
}