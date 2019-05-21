package life.conservation.my.db;

import org.springframework.web.bind.annotation.*;

@RestController
public class HomeController {
    @RequestMapping("/")
    String home() {
        return "Hello world";
    }
}