using Microsoft.AspNetCore.Mvc;
using Server.BL;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {


        // GET api/<AuthController>/5
        [HttpPost("sign-up")]
        public IActionResult SignUp([FromBody ]User u)
        {

            int result = Server.BL.User.SignUp(u);
            if (result > 0)
            {
                return Ok(result);
            }
            else return BadRequest();
        }

        // GET api/<AuthController>/5
        [HttpPost("login")]
        public IActionResult Login(String email, String password)
        {
            User? user = Server.BL.User.Login(email, password);
            if (user != null)
            {
                return Ok(user);
            }
            return BadRequest();
        }

        
    }
}
