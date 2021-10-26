import { UsernamePasswordInput } from "./UsernamePasswordInput"

export const validateRegister = (options: UsernamePasswordInput) => {
    if(options.username.length <= 2){
            return
                [
                    {field: 'Username', message: "Username is too short!"}
                ];
    }

    if(options.username.includes("@")){
            return
                [
                    {field: 'Username', message: "Username cannot include @"}
                ];
    }

    if(options.email.length <= 2 || !options.email.includes("@")){
        return
            [
                {field: 'E-mail', message: "E-mail is invalid or too short!"}
            ];
    }

    if(options.password.length <= 6){
        return
            [
                {field: 'Password', message: "Password is too short!"}
            ];
    }

    return null;
}