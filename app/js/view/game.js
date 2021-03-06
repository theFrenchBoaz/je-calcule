

define([

	'jquery',
	'backbone',
	'marionette',
	'templates',
],
function (

	$,
	Backbone,
	Marionette
) {

    'use strict';



    return Marionette.LayoutView.extend
    ({

        template: JST['game.html'],
		template_calculation: JST['calculation.html'],
        template_button_number: JST['button_number.html'],
        template_button_next: JST['button_next.html'],
		template_title: JST['title.html'],

        templateHelpers: function()
        {

            return {
                        'operator': this.options.operator,
                        'level': this.options.level,
                        'line_account': this._line_account
                    };
        },

        events:
        {
            "submit": "checkResult",
            "click @ui.numbers": "addNumber",
            "click @ui.nexts": "render",
            "click @ui.reset": "reset",
        },

        ui:
        {
            "title": ".end_title",
            "numbers": ".number",
            "nexts": ".next",
            "keyboard": "#keyboard",
            "reset": "#reset",
            "fireworks": ".fireworks",
			'calculation': '.calculation'
        },


        initialize: function () {

			this.radio = Backbone.Wreqr.radio.channel('global');
		},




        onBeforeRender: function()
        {

            var level       = this.options.level;
            var number1	= Math.round(Math.random() * Math.pow(10, level));
            var number2	= Math.round(Math.random() * Math.pow(10, level));

            switch (this.options.operator)
            {
                case "1":
                        this._operator_type = "+";
                        this.total	= number1 + number2;
                    break;
                case "2":
                        this._operator_type = "-";
                        if (number2 > number1)
                        {
                            var temp = number2;
                            number2 = number1;
                            number1 = temp;
                        }
                        this.total	= number1 - number2;
                    break;
                case "3":
                        this._operator_type = "x";
                        this.total	= number1 * number2;
                    break;
                case "4":
                        this._operator_type = "/";
                        var number1	= Math.round(Math.random() * (10*level));
                        var number2	= Math.round(Math.random() * (10*level)) + 1;
                        number1 = number1 * number2;
                        this.total = number1 / number2;
                    break;
            }

            this._number1 = number1;
            this._number2 = number2;


            this._line_account = number1+" "+this._operator_type+" "+number2+" = ";

        },

        onRender:function()
        {
			this.radio.commands.execute('buttonBackHome:show');

            this.ui.keyboard.show();

            for (var i = 0; i <= 9; i++)
            {
                var html = this.template_button_number({"button_number":i});

                $("#button_number_"+i, this.$el).html(html);
            }


			this.ui.calculation.html(

				this.template_calculation({

					'number1': this._number1,
					'number2': this._number2,
					'operator': this._operator_type
				})
			);

			this.ui.nexts.html(

				this.template_button_next({

					'button_next': document.webL10n.get('next')
				})
			);
        },







        checkResult: function(e)
        {
            e.preventDefault();
            this.ui.keyboard.hide();

            if ($('#userResult').text() == this.total)
            {
                 this.ui.title.html(

                    this.template_title({

                        'text': document.webL10n.get('win')
                    })
                );
                this.ui.fireworks.show();

            }
            else
            {
                $('#red_line').show();
                $('#red_line').css("width", $('#userResult').width());
                $('#good_result').text(this.total);
                $('#good_result_conteneur').show();

                this.ui.title.html(

                    this.template_title({

                        'text': document.webL10n.get('lose')
                    })
                );

            }
            this.ui.nexts.show();
            this.ui.nexts.focus();
        },


        reset: function(e)
        {
            //this.ui.total.text('');
            $('#userResult').text('');
        },

        addNumber: function(e)
        {
            $('#userResult').append(e.currentTarget.dataset.number);
        },


	});
});
