function check(user,message, permission){
    if(user.hasPermission(permission) == false){
        message.channel.send("**:x: Vous ne disposez pas de la permission nécessaire. (" + permission + ")**")
        message.delete()
        return false;
    }
    console.log(user.hasPermission(permission))
    return true;
}
module.exports = check