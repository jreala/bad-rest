using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace BadREST.Controllers
{
    [Route("api/[controller]")]
    public class BadRestController : Controller
    {
        private static readonly HttpClient client = new HttpClient();

        [HttpGet("[action]")]
        public async Task<List<TweetData>> Tweets(string startDate, string endDate)
        {
            var tweets = new HashSet<TweetData>();
            var queryMoreData = true;
            var date1 = startDate;
            var date2 = endDate;

            while (queryMoreData)
            {
                var dataset = await RequestData(date1, date2);

                queryMoreData = dataset.Count >= 100;
                dataset.ForEach(tweet => tweets.Add(tweet));

                if (tweets.Count > 0)
                {
                    date1 = tweets.Last().stamp;
                }
            }

            return tweets.ToList().OrderBy(tweet => tweet.stamp).ToList();
        }

        private async Task<List<TweetData>> RequestData(string startDate, string endDate)
        {
            DateTime.TryParse(startDate, out DateTime dateTime1);
            DateTime.TryParse(endDate, out DateTime dateTime2);

            var result = await client.GetAsync($"https://badapi.iqvia.io/api/v1/Tweets?startDate={dateTime1.ToString("yyyy-MM-ddTHH:mm:ssZ")}&endDate={dateTime2.ToString("yyyy-MM-ddTHH:mm:ssZ")}");
            var jsonData = await result.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<List<TweetData>>(jsonData);
        }

        public class TweetData
        {
            public string id { get; set; }
            public string stamp { get; set; }
            public string text { get; set; }

            public override bool Equals(object obj)
            {
                return obj is TweetData data && string.Equals(data.id, id) && string.Equals(data.stamp, stamp) && string.Equals(data.text, text);
            }

            public override int GetHashCode()
            {
                return id.GetHashCode() ^ stamp.GetHashCode() ^ text.GetHashCode();
            }
        }
    }
}
