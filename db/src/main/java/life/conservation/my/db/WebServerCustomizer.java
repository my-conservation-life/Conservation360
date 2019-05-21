package life.conservation.my.db;

import org.springframework.boot.web.server.ConfigurableWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.stereotype.Component;

@Component
public class WebServerCustomizer
  implements WebServerFactoryCustomizer<ConfigurableWebServerFactory> {

    /**
     * Set the web server port to the PORT environment variable, if defined. Otherwise, leave the default setting.
     * 
     * This feature is required to deploy to Heroku
     */
    @Override
    public void customize(ConfigurableWebServerFactory factory) {
        String portString = System.getenv("PORT");

        try {
            int port = Integer.parseUnsignedInt(portString);
            factory.setPort(port);
            return;
        } catch (NumberFormatException e) {
        }
    }
}