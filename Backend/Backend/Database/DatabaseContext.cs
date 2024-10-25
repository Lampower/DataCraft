using Backend.Common.Configurations;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database
{
    public class DatabaseContext: DbContext
    {
        public DatabaseContext() 
        { 
            Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(DatabaseConfig.SQLITE_CONNECTION_STRING);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

    }
}
