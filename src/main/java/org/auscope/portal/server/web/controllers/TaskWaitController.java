package org.auscope.portal.server.web.controllers;

import javax.servlet.http.HttpServletRequest;

import org.auscope.portal.core.server.controllers.BasePortalController;
import org.auscope.portal.core.server.security.oauth2.PortalUser;
import org.auscope.portal.server.web.service.JobTaskService;
import org.auscope.portal.server.web.service.jobtask.JobTask;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@RequestMapping("taskwait")
@Controller
public class TaskWaitController extends BasePortalController {

    private JobTaskService jobTaskService;

    @Autowired
    public TaskWaitController(JobTaskService jobTaskService) {
        super();
        this.jobTaskService = jobTaskService;
    }

    @RequestMapping("setEmailNotification.do")
    public ModelAndView setEmailNotification(HttpServletRequest request,
            @RequestParam("notify") boolean notify,
            @RequestParam("taskId") String taskId,
            @AuthenticationPrincipal PortalUser user) {

        String email = null;
        if (!notify) {
            email = null;
        } else if (user == null) {
            //TODO - this should not be defaulting
            log.error("TODO - please dont leave this default email here");
            email = "Josh.Vote@csiro.au";
        } else {
            email = user.getEmail();
        }

        JobTask task = jobTaskService.getTask(taskId);
        if (task != null) {
            //TODO - need to manage persistence
            task.setEmail(email);
        }

        return generateJSONResponseMAV(true);
    }

    @RequestMapping("isExecuting.do")
    public ModelAndView setEmailNotification(HttpServletRequest request,
            @RequestParam("taskId") String taskId,
            @AuthenticationPrincipal PortalUser user) {

        return generateJSONResponseMAV(true, jobTaskService.isExecuting(taskId), "");
    }
}
