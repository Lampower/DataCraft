namespace Backend.Common.Extensions
{
    public static class ParseStringExtension
    {
        public static int? ParseToNullableInt(this string value)
        {
            int i;
            if (int.TryParse(value, out i)) return i;
            return null;
        }
    }
}
