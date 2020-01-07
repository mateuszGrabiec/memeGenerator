package pl.wlodarczyk.meme.Service;

import org.springframework.stereotype.Service;

import org.springframework.web.client.RestTemplate;
import pl.wlodarczyk.meme.Model.Container;
import pl.wlodarczyk.meme.Model.Meme;

import java.util.List;

@Service
public class MemeService {
    private List<Meme> memeList;

    public MemeService() {
        RestTemplate restTemplate = new RestTemplate();
        Container container;
        container = restTemplate.getForObject("https://api.imgflip.com/get_memes", Container.class);
        assert container != null;
        this.memeList = container.getData().getMemes();
    }

    public List<Meme> getMemeUrl(){
        return this.memeList;
    }

    public Meme getMemeById(String id) {
        for (Meme meme : this.memeList) {
            if (meme.getId().equals(id)) return meme;
        }
        return null;
    }

}