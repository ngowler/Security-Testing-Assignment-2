using System;
using System.Data.SqlClient; // Assuming you're using SQL Server, though your Python code suggests MySQL
using System.Net.Http;

class Program
{
    static readonly string connectionString = "Server=mydatabase.com;User Id=admin;Password=secret123;";

    static void Main(string[] args)
    {
        string userInput = GetUserInput();
        string data = GetData();
        SaveToDb(data);
        SendEmail("admin@example.com", "User Input", userInput); // Hardcoded email address
    }

    static string GetUserInput()
    {
        Console.WriteLine("Enter your name: ");
        return Console.ReadLine(); // No validation or sanitization of user input
    }

    static void SendEmail(string to, string subject, string body)
    {
        // Placeholder implementation, does not actually send an email
        Console.WriteLine($"Sending email to {to} with subject {subject} and body {body}");
    }

    static string GetData()
    {
        string url = "http://insecure-api.com/get-data"; // Insecure API URL
        HttpClient client = new HttpClient();
        var response = client.GetAsync(url).Result; // Blocking call, no error handling
        var data = response.Content.ReadAsStringAsync().Result;
        return data;
    }

    static void SaveToDb(string data)
    {
        string query = $"INSERT INTO mytable (column1, column2) VALUES ('{data}', 'Another Value')"; // Vulnerable to SQL injection
        using (SqlConnection connection = new SqlConnection(connectionString))
        {
            connection.Open(); // No error handling for database connection
            SqlCommand command = new SqlCommand(query, connection);
            command.ExecuteNonQuery(); // Assuming the query always succeeds
        }
    }
}
