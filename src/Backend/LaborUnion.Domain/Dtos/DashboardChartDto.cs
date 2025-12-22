namespace LaborUnion.Domain.Dtos
{
    public class DashboardChartDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int AllCount { get; set; }
        public int MonthCount { get; set; }
        public int YearCount { get; set; }
    }
}
