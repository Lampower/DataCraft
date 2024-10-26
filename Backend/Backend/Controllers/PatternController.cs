using Backend.Database;
using Backend.Database.Models;
using Backend.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("pattern")]
    public class PatternController : ControllerBase
    {
        private readonly DatabaseContext context;

        public PatternController(DatabaseContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var entities = context.Patterns.ToList();
            return Ok(entities);
        }

        [HttpPost]
        public IActionResult Post([FromBody] PatternRequestDto pattern) 
        { 
            var entity = new PatternEntity();
            entity.PatternName = pattern.PatternName;
            entity.PatternFilter = pattern.PatternFilter;
            context.Add(entity);
            context.SaveChanges();
            return Ok(entity);
        }
    }
}
