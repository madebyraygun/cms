jQuery,Craft.RecoveryCodeForm=Garnish.Base.extend({init:function(e,t,o){var r=e.querySelector("input.auth-recovery-code"),n=e.querySelector("button.submit");this.addListener(r,"input",(function(t){12===r.value.replace(/-/g,"").length&&e.requestSubmit()})),this.addListener(e,"submit",(function(e){e.preventDefault(),n.classList.contains("loading")||(n.classList.add("loading"),Craft.sendActionRequest("POST","auth/verify-recovery-code",{data:{code:r.value}}).then((function(){t()})).catch((function(e){var t,r;o(null==e||null===(t=e.response)||void 0===t||null===(r=t.data)||void 0===r?void 0:r.message)})).finally((function(){n.classList.remove("loading")})))}))}},{METHOD:"craft\\auth\\methods\\RecoveryCodes"}),Craft.registerAuthFormHandler(Craft.RecoveryCodeForm.METHOD,Craft.RecoveryCodeForm);
//# sourceMappingURL=recoverycodes.js.map