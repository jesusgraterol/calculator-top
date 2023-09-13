/**
 * App
 * The following class implements the Calculator Project.
 */
class App {
    // Screen
    #result_heading_el;
    #result_el;

    // Controller
    #controller_keys;
    #calculator_controller_el;

    // Operation
    #operand_1 = "";
    #operand_2 = "";
    #operator = "";
    #temp_result = "";

    // Error Toastr
    #error_toastr_el;

    constructor () {
        // Initialize the result elements
        this.#result_heading_el = document.getElementById("result_heading");
        this.#result_el = document.getElementById("result");

        // Initialize the controllers' keys
        this.#controller_keys = this.#build_controller_keys();

        // Initialize the controller, subscribe to it and handle click actions
        this.#calculator_controller_el = document.getElementById("calculator_controller");
        this.#calculator_controller_el.addEventListener("click", (e) => this.#on_click(e));

        // Subscribe to the keyboard events and handle press actions
        window.addEventListener("keydown", (e) => this.#on_key_down(e));
        window.addEventListener("keyup", (e) => this.#on_key_up(e));

        // Initialize the error toastr and hide it on click
        this.#error_toastr_el = document.getElementById("error_toastr");
        this.#error_toastr_el.addEventListener("click", () => this.#hide_error());

        // Initialize the screen
        this.#update_screen();
    }


    



    /*****************
     * INPUT HANDLER *
     *****************/




    /**
     * Triggers whenever the app detects an input action. Can be invoked by clicking on the
     * calculator's controller or by interacting with the Keyboard.
     * @param key 
     */
    #on_input(key) {
        try {
            // Handle numeric input
            if (!isNaN(key.value)) { 
                // Process the input
                this.#on_numeric_input(key.value);

                // Populate the temp result if possible
                this.#temp_result = this.#execute_operation();
            }

            // Handle a decimal input
            else if (key.value == ".") { this.#on_decimal_input() }

            // Handle an operator input
            else if (
                key.value == "÷" ||
                key.value == "x" ||
                key.value == "-" ||
                key.value == "+"
            ) { this.#on_operator_input(key.value) }

            // Handle an operate action
            else if (key.value == "=") { this.#on_operate_input() }

            // Handle a clear action
            else if (key.value == "clear") { this.#on_clear_input() }

            // Handle a delete action
            else if (key.value == "delete") { this.#on_delete_input() }


            // Finally, update the screen
            this.#update_screen();
        } catch (e) { 
            console.error(e);
            this.#display_error(e);
        }
    }



    /* Handles the input of a numeric value and places it where it is meant to go */
    #on_numeric_input(value) {
        if      (this.#operand_1.length && this.#operator.length) { this.#operand_2 += value } 
        else if (!this.#operator.length) { this.#operand_1 += value }
    }

    /* Handles the input of a decimal (dot) */
    #on_decimal_input() {
        if (this.#operator.length && this.#operand_2.length && !this.#operand_2.includes(".")) {
            this.#operand_2 += ".";
        }  else if (
            this.#operand_1.length && 
            !this.#operand_2.length && 
            !this.#operand_1.includes(".")
        ) {
            this.#operand_1 += ".";
        } 
    }

    /* Handles the input of an operator */
    #on_operator_input(value) {
        if (this.#operand_1.length && !this.#operator.length) this.#operator = value;
    }

    /* Handles the input of the operate action */
    #on_operate_input() {
        // Only operate if all values have been set
        if (this.#operand_1.length && this.#operator.length && this.#operand_2.length) {
            // Perform the operation and set it as the new operand 1
            this.#operand_1 = this.#execute_operation();

            // Reset the operator and the second operand
            this.#operator = "";
            this.#operand_2 = "";
        }
    }

    /* Handles the clear action */
    #on_clear_input() {
        this.#operand_1 = "";
        this.#operand_2 = "";
        this.#operator = "";
        this.#temp_result = "";
    }

    /* Handles the delete action */
    #on_delete_input() {
        if (this.#operator.length && this.#operand_2.length) {
            this.#operand_2 = this.#operand_2.slice(0, this.#operand_2.length - 1);
        } else if (this.#operator.length && !this.#operand_2.length) {
            this.#operator = "";
        } else if (this.#operand_1.length && !this.#operator.length) {
            this.#temp_result = "";
            this.#operand_1 = this.#operand_1.slice(0, this.#operand_1.length - 1);
        }
    }





    /**
     * Executes the operation if all values have been set. Otherwise, it returns an empty string.
     * @returns string
     */
    #execute_operation() {
        if (this.#operand_1.length && this.#operator.length && this.#operand_2.length) {
            // Format the numeric values
            const operand_1 = parseFloat(this.#operand_1);
            const operand_2 = parseFloat(this.#operand_2);

            // Init the result
            let res;

            // Handle the operation according to the operand
            if      (this.#operator == "÷") { res = (operand_1 / operand_2).toFixed(2) }
            else if (this.#operator == "x") { res = (operand_1 * operand_2).toFixed(2) }
            else if (this.#operator == "-") { res = (operand_1 - operand_2).toFixed(2) }
            else                           { res = (operand_1 + operand_2).toFixed(2) }

            // Finally, return the result
            return res;
        } else { return "" }
    }








    /* Calculator Screen */





    /**
     * Updates the calculator's string after an input event.
     */
    #update_screen() {
        this.#result_heading_el.innerText = this.#get_result_heading_text();
        this.#result_el.innerText = this.#get_result_text();
    }




    /**
     * Puts together the result heading text based on the current state.
     * @returns string
     */
    #get_result_heading_text() {
        if (this.#operator.length && this.#operand_2.length) {
            return `${this.#operand_1} ${this.#operator} ${this.#operand_2} =`;
        } else if (this.#operator.length && !this.#operand_2.length) {
            return `${this.#operand_1} ${this.#operator}`;
        } else {
            return "";
        }
    }



    /**
     * Based on the current state of the calculator, it selects the value to be displayed in the
     * result field.
     * @returns string
     */
    #get_result_text() {
        if      (this.#temp_result.length)  { return this.#temp_result }
        else if (this.#operand_1.length)    { return this.#operand_1 }
        else                                { return "0" }
    }











    /**********************************
     * CONTROLLER CLICK EVENT HANDLER *
     **********************************/





    #on_click(e) {
        // Retrieve the key's object based on its id
        const key = this.#get_controller_key_by_id(e.target.id);

        // Proceed if a key was found
        if (key) this.#on_input(key);
    }










    /***************************
     * KEYBOARD EVENT HANDLERS *
     ***************************/



    /**
     * Whenever the keyboard is pressed, it retrieves the key's object and handles the action
     * accordingly
     * @param e 
     */
    #on_key_down(e) {
        // Retrieve the key's object
        const key = this.#get_controller_key_by_code(e.code);
        
        // Proceed if it exists
        if (key) {
            // Set the button as clicked
            key.el.classList.add("clicked");

            // Handle the action
            this.#on_input(key);
        }
    }




    /**
     * Releases the key button once the key is not longer pressed.
     * @param e 
     */
    #on_key_up(e) { this.#get_controller_key_by_code(e.code)?.el.classList.remove("clicked") }













    /***************************
     * CONTROLLER KEYS HELPERS *
     ***************************/




    /**
     * Retrieves a key object by id or code if found. Otherwise returns undefined.
     * @param code 
     * @returns {el: HTMLElement, codes: Array<string>, value: string}|undefined
     */
    /*#get_controller_key(id_or_code) {
        return  this.#get_controller_key_by_code(id_or_code) || 
                this.#get_controller_key_by_id(id_or_code);
    }*/


    /**
     * Retrieves a key object by code if found. Otherwise returns undefined.
     * @param code 
     * @returns {el: HTMLElement, codes: Array<string>, value: string}|undefined
     */
    #get_controller_key_by_code(code) { 
        return this.#controller_keys.find((key) => key.codes.includes(code));
    }



    /**
     * Retrieves a key object by ID if found. Otherwise returns undefined.
     * @param id 
     * @returns {el: HTMLElement, codes: Array<string>, value: string}|undefined
     */
    #get_controller_key_by_id(id) { return this.#controller_keys.find((key) => key.el.id == id) }



    /**
     * Builds and returns the controller keys object including the element instances.
     * @returns Array<{el: HTMLElement, codes: Array<string>, value: string}>
     */
    #build_controller_keys() {
        return [
            // Row: 1
            { 
                el: document.getElementById("clear_button"),
                codes: ["Escape"],
                value: "clear"
            },
            { 
                el: document.getElementById("delete_button"),
                codes: ["Backspace", "Delete"], 
                value: "delete"
            },

            // Row 2
            { 
                el: document.getElementById("7_button"),
                codes: ["Numpad7", "Digit7"], 
                value: "7"
            },
            { 
                el: document.getElementById("8_button"),
                codes: ["Numpad8", "Digit8"], 
                value: "8"
            },
            { 
                el: document.getElementById("9_button"),
                codes: ["Numpad9", "Digit9"], 
                value: "9"
            },
            { 
                el: document.getElementById("division_button"),
                codes: ["NumpadDivide", "Slash"], 
                value: "÷"
            },

            // Row 3
            { 
                el: document.getElementById("4_button"),
                codes: ["Numpad4", "Digit4"], 
                value: "4"
            },
            { 
                el: document.getElementById("5_button"),
                codes: ["Numpad5", "Digit5"], 
                value: "5"
            },
            { 
                el: document.getElementById("6_button"),
                codes: ["Numpad6", "Digit6"], 
                value: "6"
            },
            { 
                el: document.getElementById("multiplication_button"),
                codes: ["NumpadMultiply"], 
                value: "x"
            },

            // Row 4
            { 
                el: document.getElementById("1_button"),
                codes: ["Numpad1", "Digit1"], 
                value: "1"
            },
            { 
                el: document.getElementById("2_button"),
                codes: ["Numpad2", "Digit2"], 
                value: "2"
            },
            { 
                el: document.getElementById("3_button"),
                codes: ["Numpad3", "Digit3"], 
                value: "3"
            },
            { 
                el: document.getElementById("subtraction_button"),
                codes: ["NumpadSubtract", "Minus"], 
                value: "-"
            },

            // Row 5
            { 
                el: document.getElementById("dot_button"),
                codes: ["NumpadDecimal", "Period"], 
                value: "."
            },
            { 
                el: document.getElementById("0_button"),
                codes: ["Numpad0", "Digit0"], 
                value: "0"
            },
            { 
                el: document.getElementById("equals_button"),
                codes: ["NumpadEnter", "Enter", "Equal"], 
                value: "="
            },
            { 
                el: document.getElementById("addition_button"),
                codes: ["NumpadAdd"], 
                value: "+" 
            }
        ];
    }











    /****************
     * ERROR TOASTR *
     ****************/


    /**
     * Displays an error as long as there isn't an active one.
     * @param error 
     */
    #display_error(error) {
        // Only show the error if it is hidden
        if (this.#error_toastr_el.classList.contains("hidden")) {
            // Insert the message in the box
            this.#error_toastr_el.innerText = this.#get_error_message(error);
            
            // Remove the hidden class and add it again in 3 seconds
            this.#error_toastr_el.classList.remove("hidden");
            setTimeout(() => { this.#error_toastr_el.classList.add("hidden") }, 3000);
        }
    }


    /**
     * Extracts the error message from a given value based on its type.
     * @param error 
     * @returns string
     */
    #get_error_message(error) {
        if (typeof error == "string") {
            return error;
        } else if (error && typeof error == "object") {
            return error.message || JSON.stringify(error);
        } else {
            console.log(error);
            return "Unknown error. Please review the console for more information.";
        }
    }


    /**
     * Hides the error
     */
    #hide_error() { this.#error_toastr_el.classList.add("hidden") }
}











/**
 * App Initializer
 * Initializes the instance of the application once the HTML has been put together.
 * DO NOT MODIFY THIS CODE
 */
const app = new App();