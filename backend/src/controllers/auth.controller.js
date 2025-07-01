export async function signup(req,res){
    const {email,password,fullName} = req.body;
}

export async function login(req,res){
    res.send("Signup Route");
}

export async function logout(req,res){
    res.send("Signup Route");
}