[![](https://data.jsdelivr.com/v1/package/npm/pal.video/badge)](https://www.jsdelivr.com/package/npm/pal.video)

# Pal.video | web plugin
Your new in app friend.<br/>
Integrate video story within your app.
<br/>
- Get feedbacks in your app using the power of videos.
- Onboard your users

## Installation with node
```bash
npm i pal.video
```

[Page npm de pal.video](https://www.npmjs.com/package/pal.video)

**Add pal style file**
Open your index.html file and add this style file between ```<head>``` and ```</head>``` like this


```html
<head>
    ...
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pal.video/build/style.css" type="text/css" />
</head>
```

## Installation using html only
Open your index.html file and add these style and js files between ```<head>``` and ```</head>``` like this :
```html
<head>
    ...
    <script src="https://cdn.jsdelivr.net/npm/pal.video/build/pal.min.js" type="text/javascript"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pal.video/build/style.css" type="text/css" />
</head>
```

## Send an event 
Inside the body of your page. 
<br/>
<br/>

**1 - Setup the pal instance** 

```html
<script type="text/javascript">
    var devApiKey = "eyJ...";
    var prodApiKey = "eyJ0...";

    var pal = pal.Pal.createInstance({
        apiKey: prodApiKey
    });
</script>
```

<br/>
<br/>

**2 - Send the Pal event on every page** 

```html
<script type="text/javascript">
    var pal = pal.Pal.getInstance()
    pal.initialize().then(() => {
        pal.logCurrentScreenAuto();
    });
</script>
```

If you prefer sending the event with a manual path please use this :
```javascript
logCurrentScreen('/mypage/'); // don't include your domain name here. Only the path 
```

## Documentation
[📙 Check our complete documentation here](https://doc.pal.video)

## Compile 

```bash
npm run compile-browser
```

- bundle js for inline browser (rollup)[https://www.npmjs.com/package/rollup]
check examples
* https://github.com/spatialillusions/milsymbol/blob/master/rollup.config.js
* https://github.com/ghosh/Micromodal/blob/master/lib/rollup.config.js


## Example run

```bash
cd example/webpage 
npm install
npm start
```