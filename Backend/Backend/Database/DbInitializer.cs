namespace Backend.Database
{
    public class DbInitializer
    {
        public static void Initialize(DatabaseContext context)
        {
            context.Database.EnsureCreated();
        }
        public static void Drop(DatabaseContext context)
        {
            context.Database.EnsureDeleted();
        }
    }
}
