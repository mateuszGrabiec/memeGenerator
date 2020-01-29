package pl.wlodarczyk.meme.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import pl.wlodarczyk.meme.Service.MemeService;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
@RequestMapping("/")
public class MemeController {
    private MemeService memeService;

    @Autowired
    public MemeController(MemeService memeService) {
        this.memeService = memeService;
    }

    @GetMapping
    public String index(Model model){
        model.addAttribute("memeList", memeService.getMemeUrl());
        return "index";
    }

    @GetMapping("/custom")
    public String custom(){
        return "custom-edit";
    }

    @RequestMapping(value = "/this-meme", method = GET)
    public String get(@RequestParam("name") String id, Model model) {
        model.addAttribute("meme",memeService.getMemeById(id));
        model.addAttribute("numOfBox",memeService.getMemeById(id).getBoxCount());
        return "edit";
    }
}