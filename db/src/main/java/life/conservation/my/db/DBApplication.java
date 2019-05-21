package life.conservation.my.db;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
@EnableAutoConfiguration
public class DBApplication {

	@RequestMapping("/")
	String home() {
		return "Hello world!";
	}

	public static void main(String[] args) {
		SpringApplication.run(DBApplication.class, args);
	}

}
