namespace LaborUnion.Communication.Responses
{
    public class ResponseChartDataJson
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int AllCount { get; set; }
        public int MonthCount { get; set; }
        public int YearCount { get; set; }
    }
}
