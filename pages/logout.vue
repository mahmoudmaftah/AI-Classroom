<script>
export default{
    async mounted(){
        await fetch("/api/del-my-auth-data")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                // if (data.auth_token) {
                //     // this.$router.push("/");
                // }
            })
            .catch((err) => {
                console.error(err);
            });
        
            this.$router.push("/");
    }
}
</script>