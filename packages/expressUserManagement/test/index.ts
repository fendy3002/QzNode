import app from './app';
app.app.listen(process.env.PORT || 3000, () => {
    console.log("App listen on port " + (process.env.PORT || 3000));
});