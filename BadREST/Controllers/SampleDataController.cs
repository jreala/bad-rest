using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Runtime.Serialization.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Specialized;

namespace BadREST.Controllers
{
    [Route("api/[controller]")]
    public class BadRestController : Controller
    {
        private static readonly HttpClient client = new HttpClient();

        private static string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        //[HttpGet("[action]")]
        //public IEnumerable<WeatherForecast> WeatherForecasts()
        //{
        //    var rng = new Random();
        //    return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        //    {
        //        DateFormatted = DateTime.Now.AddDays(index).ToString("d"),
        //        TemperatureC = rng.Next(-20, 55),
        //        Summary = Summaries[rng.Next(Summaries.Length)]
        //    });
        //}

        [HttpGet("[action]")]
        public async Task<TweetData[]> Tweets(string startDate, string endDate)
        {
            Stack<TweetData> tweets = new Stack<TweetData>();
            var queryMoreData = true;
            var date1 = startDate;
            var date2 = endDate;

            while(queryMoreData)
            {
                var dataset = await RequestData(date1, date2);
                queryMoreData = dataset.Count >= 100;

                dataset.ForEach(tweet => {
                    if (tweets.Count == 0 || tweets.Peek() != tweet)
                    {
                        tweets.Push(tweet);
                    }
                });

                if(tweets.Count > 0)
                {
                    date1 = tweets.Peek().stamp;
                }
            }

            return tweets.ToArray();
        }

        private async Task<List<TweetData>> RequestData(string startDate, string endDate)
        {
            DateTime dateTime1, dateTime2;
            DateTime.TryParse(startDate, out dateTime1);
            DateTime.TryParse(endDate, out dateTime2);

            var sD1 = dateTime1.ToString("yyyy-MM-ddTHH:mm:ssZ");
            var sD2 = dateTime2.ToString("yyyy-MM-ddTHH:mm:ssZ");


            var result = await client.GetAsync($"https://badapi.iqvia.io/api/v1/Tweets?startDate={sD1}&endDate={sD2}");
            var jsonData = await result.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<List<TweetData>>(jsonData);
        }

        public class TweetData
        {
            public string id { get; set; }
            public string stamp { get; set; }
            public string text { get; set; }
        }
    }
}
