namespace Backend.Dto
{
    public class DiagramRequestDto
    {
        public int Days { get; set; }
        public List<FilterDto> Filters { get; set; } = new();
        public string Column { get; set; } = "";
    }
}
