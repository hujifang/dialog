package com.hjf.dialog;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class controller {
    @RequestMapping("/")
    public String index(){
        return "test";
    }
    @RequestMapping("/test2")
    public String test2() {
        return "test2";
    }
}
