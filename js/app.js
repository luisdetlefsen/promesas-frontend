

new Vue(
    {
        el: '#app'
        , data: {
            appName: 'Promesometro'
            , candidatePromise: {
                selectedParty: null
                , selectedCandidate: null
                , enteredText: ''                
            }
        }


        , methods: {
            addCandidatePromise: function(){
                if(this.candidatePromise.enteredText == ''){
                    bootbox.alert({
                        title: 'Error'
                        ,message: "No hay texto"
                    });
                    return;
                }
                bootbox.alert({
                    title: 'Promesa agregada'
                    ,message: this.candidatePromise.enteredText
                });

                // bootbox.alert("Promesa " + this.candidatePromise.enteredText, function() {
                //     console.log("Alert Callback");
                // });
            }

            , login: function(){
                bootbox.alert("Bienvenido", function(){})
            }
        }
    }
);