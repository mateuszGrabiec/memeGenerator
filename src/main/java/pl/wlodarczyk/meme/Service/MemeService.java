package pl.wlodarczyk.meme.Service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import pl.wlodarczyk.meme.Model.Container;
import pl.wlodarczyk.meme.Model.Meme;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class MemeService {

    public List<Meme> getMemeUrl() {
//        RestTemplate restTemplate = new RestTemplate();
//        Container container;
//            container = restTemplate.getForObject("https://api.imgflip.com/get_memes", Container.class);
//            if (container != null) {
//                if (container.getData() != null)
//                    if (container.getData().getMemes() != null) return container.getData().getMemes();
//            }
//        return null;

            RestTemplate rt = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            headers.add("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36");
            HttpEntity<Container> entity = new HttpEntity<>(headers);
            String url = "https://api.imgflip.com/get_memes";
            ResponseEntity<Container> res = rt.exchange(url, HttpMethod.GET, entity, Container.class);
            if(res.getBody()!=null)return res.getBody().getData().getMemes();
            else return null;
    }

    public Meme getMemeById(String id) {
        for (Meme meme :getMemeUrl()) {
            if (meme.getId().equals(id)) return meme;
        }
        return null;
    }

}