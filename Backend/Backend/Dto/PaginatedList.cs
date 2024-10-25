namespace Backend.Dto
{
    public class PaginatedList<T>
    {
        public int TotalLength { get; set; }
        public List<T> Entities { get; set; } = new();
    }
}
