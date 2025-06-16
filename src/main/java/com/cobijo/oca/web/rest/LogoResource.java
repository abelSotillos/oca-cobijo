package com.cobijo.oca.web.rest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for exposing available logo images.
 */
@RestController
@RequestMapping("/api")
public class LogoResource {

    private static final Logger LOG = LoggerFactory.getLogger(LogoResource.class);

    /**
     * {@code GET  /logos} : get all available logo paths.
     *
     * @return the list of logo image paths relative to the web context.
     */
    @GetMapping("/logos")
    public List<String> getLogos() throws IOException {
        LOG.debug("REST request to list logo images");
        List<String> logos = new ArrayList<>();
        // Try to load resources from the classpath (production) first
        Resource resource = new ClassPathResource("static/content/images/logos");
        Path logosPath;
        if (resource.exists()) {
            logosPath = resource.getFile().toPath();
        } else {
            // Fallback to the source path during development
            logosPath = Path.of("src/main/webapp/content/images/logos");
        }
        if (Files.exists(logosPath)) {
            logos = Files.list(logosPath)
                .filter(Files::isRegularFile)
                .map(Path::getFileName)
                .map(Path::toString)
                .map(name -> "/content/images/logos/" + name)
                .collect(Collectors.toList());
        }
        return logos;
    }
}
