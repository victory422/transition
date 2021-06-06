package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {
	
	@RequestMapping("/")
	public String home() {
		System.out.println("/");
		return "home";
	}
	
	@RequestMapping("/go.do")
	public String go() {
		System.out.println("/go");
		return "go";
	}
	
	@RequestMapping("/talen")
	public String talen() {
		System.out.println("/talen");
		return "talen";
	}
	
}
