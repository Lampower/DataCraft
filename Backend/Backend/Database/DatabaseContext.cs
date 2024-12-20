﻿using Backend.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database
{
    public class DatabaseContext: DbContext
    {
        public DbSet<PropertiesEntity> Properties { get; set; }
        public DbSet<HistoryEntity> Histories { get; set; }
        public DbSet<PatternEntity> Patterns { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=database.db");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

    }
}
