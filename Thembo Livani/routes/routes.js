app.use(`/`, authRoutes);
app.use(`/videos`, videoRoutes)
app.get(`/`, (req, res) =>{
    if (!req.cookies.userId)
    {
        res.redirect(`/join`);

    }else{
        res.redirect(`/videos`);
    }
})