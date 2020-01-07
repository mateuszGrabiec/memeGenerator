package pl.wlodarczyk.meme.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import pl.wlodarczyk.meme.Model.Container;
import pl.wlodarczyk.meme.Model.Meme;

import java.util.List;

@Service
public class MemeService {

    public MemeService() {

        }

//        try {
//            RestTemplate restTemplate = new RestTemplate();
//            HttpHeaders headers = new HttpHeaders();
//            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
//            headers.add("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36");
//            HttpEntity<Container> entity = new HttpEntity<Container>(headers);
//
//            ResponseEntity<Container> response = restTemplate.exchange("https://api.imgflip.com/get_memes", HttpMethod.GET,entity,Container.class);
//            return response.g
//
//            System.out.println(response.);
//        } catch (Exception ex) {
//            ex.printStackTrace();
//
//        }

    public List<Meme> getMemeUrl() {
        RestTemplate restTemplate = new RestTemplate();
        Container container;
        if (restTemplate.getForObject("https://api.imgflip.com/get_memes", Container.class) != null) {
            container = restTemplate.getForObject("https://api.imgflip.com/get_memes", Container.class);
            if (container != null) {
                if (container.getData() != null)
                    if (container.getData().getMemes() != null) return container.getData().getMemes();
            }
        }
        return null;
    }

    public Meme getMemeById(String id) {
        for (Meme meme :getMemeUrl()) {
            if (meme.getId().equals(id)) return meme;
        }
        return null;
    }

}