using Server.BL;
using System.Data;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Hosting;
using System.Text.Json;


namespace Server.DAL
{
    public class Database
    {
        public SqlDataAdapter da;
        public DataTable dt;

        public Database()
        {

        }

        public SqlConnection connect(String conString)
        {

            // read the connection string from the configuration file
            IConfigurationRoot configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json").Build();
            string cStr = configuration.GetConnectionString("myProjDB");
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }

        public int InsertUser(User u)
        {
            using (SqlConnection con = connect("myProjDB"))
            {
                using (SqlCommand cmd = new SqlCommand("INSERT INTO Users (FirstName, LastName, Email, PasswordHash, CreatedAt) " +
                                                       "OUTPUT INSERTED.Id " +
                                                       "VALUES (@FirstName, @LastName, @Email, @PasswordHash, SYSUTCDATETIME())", con))
                {
                    cmd.Parameters.AddWithValue("@FirstName", u.FirstName);
                    cmd.Parameters.AddWithValue("@LastName", u.LastName);
                    cmd.Parameters.AddWithValue("@Email", u.Email);
                    cmd.Parameters.AddWithValue("@PasswordHash", u.PasswordHash);

                    // returns id of signed up user
                    int newId = (int)cmd.ExecuteScalar();
                    return newId;
                }
            }
        }

        public User? LoginUser(string email)
        {
            using (SqlConnection con = connect("myProjDB"))
            {
                using (SqlCommand cmd = new SqlCommand(
                    "SELECT Id, FirstName, LastName, Email, PasswordHash, CreatedAt " +
                    "FROM Users WHERE Email = @Email", con))
                {
                    cmd.Parameters.AddWithValue("@Email", email);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new User
                            {
                                Id = reader.GetInt32(0),
                                FirstName = reader.GetString(1),
                                LastName = reader.GetString(2),
                                Email = reader.GetString(3),
                                PasswordHash = reader.GetString(4),
                            };
                        }
                        else
                        {
                            return null; // no user found
                        }
                    }
                }
            }
        }


    }
}
