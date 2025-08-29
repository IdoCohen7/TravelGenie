using Server.DAL;
using Server.Services;

namespace Server.BL
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }

        public User(int userId, string firstName, string lastName, string email, string passwordHash)
        {
            Id = userId;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            PasswordHash = passwordHash;
        }

        public User() { }

        public static int SignUp(User user)
        {
            Database db = new Database();
            user.PasswordHash = Bcrypt.HashPassword(user.PasswordHash);
            return db.InsertUser(user);
        }

        public static User? Login(String email, String password)
        {
            Database db = new Database();
            User user = db.LoginUser(email);
            if (user!=null && Bcrypt.VerifyPassword(password, user.PasswordHash))
            {
                return user;
            }
            return null;
        }

    }
}
