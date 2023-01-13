const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Đế Vương",
            singer: "Đình Dũng",
            path: "./assets/sound/music_1.mp3",
            image: "./assets/img/img_1.jpg"
        },
        {
            name: "What Are Words",
            singer: "Chris Medina",
            path: "./assets/sound/music_2.mp3",
            image:"./assets/img/img_2.jpg"
        },
        {
            name: "Mùa Yêu Đầu",
            singer: "Đinh Manh Ninh",
            path:"./assets/sound/music_3.mp3",
            image: "./assets/img/img_3.jpg"
        },
        {
            name: "Thu Cuối",
            singer: "Mr.T-Yanbi-Hằng Bingbong",
            path: "./assets/sound/music_4.mp3",
            image:"./assets/img/img_4.jpg"
        },
        {
            name: "Cơn Mưa Ngang Qua",
            singer: "Sơn Tùng M-TP",
            path: "./assets/sound/music_5.mp3",
            image:"./assets/img/img_5.jpg"
        },
        {
            name: "2AM",
            singer: "JustaTee-BigDaddy",
            path:"./assets/sound/music_6.mp3",
            image:"./assets/img/img_6.jpg"
        },
        {
            name: "See You Again",
            singer: "Wiz Khalifa",
            path: "./assets/sound/music_7.mp3",
            image:"./assets/img/img_7.jpg"
        },
        {
            name: "Haru Haru",
            singer: "Big Bang",
            path: "./assets/sound/music_8.mp3",
            image:"./assets/img/img_8.jpg"
        },
        {
            name: "How You Like That",
            singer: "BlackPink",
            path: "./assets/sound/music_9.mp3",
            image:"./assets/img/img_9.jpg"
        },
        {
            name: "Ngay Mai Em Đi",
            singer: "Lê Hiếu-Soobin Hoàng Sơn-Hoàng Touliver",
            path: "./assets/sound/music_10.mp3",
            image: "./assets/img/img_10.jpg"
        },
        {
            name: "Anh Đã Quen Với Cô Đơn",
            singer: "Soobin Hoàng Sơn",
            path: "./assets/sound/music_11.mp3",
            image: "./assets/img/img_11.jpg"
        },
        {
            name: "Vài Lần Đón Đưa",
            singer: "Soobin Hoàng Sơn-Hoàng Touliver",
            path: "./assets/sound/music_12.mp3",
            image: "./assets/img/img_12.jpg"
        },
    ],
    
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvent: function() {

        // Xử lý quay CD
        const cdAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 18000,
            iterations: Infinity
        })
        cdAnimate.pause()

        // Xử lý phóng to thu nhỏ CD
        const cdWidth = cd.offsetWidth
        document.onscroll = function () {
            const scrollTop = window.scrollY
            const newCdWidth = cdWidth - scrollTop 

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý khi click play
        playBtn.onclick = function () {
            if(app.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Xử lý khi play
        audio.onplay = function () {
            app.isPlaying = true
            player.classList.add('playing')
            cdAnimate.play()
        }

        // Xử lý khi pause
        audio.onpause = function () {
            app.isPlaying = false
            player.classList.remove('playing')
            cdAnimate.pause()
        }
        
        // Xử lý tiến độ bài hát 
        audio.ontimeupdate = function () {
            const progressPercent = audio.currentTime / audio.duration * 100
            progress.value = progressPercent
        }

        // Xử lý khi tua bài hát 
        progress.onchange = function () {
            const seekTime = audio.duration / 100 * progress.value
            audio.currentTime = seekTime
        }

        // Xử lý chuyển bài tiếp theo
        nextBtn.onclick = function () {
            if (app.isRandom) {
                app.randomSong()
            } else {
                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollView()
        }

        // Xử lý chuyển bài phía trước
        prevBtn.onclick = function () {
            if (app.isRandom) {
                app.randomSong()
            } else {
                app.prevSong()
            }
            audio.play()
            app.render()
            app.scrollView()
        }

        // Xử lý khi click nút random
        randomBtn.onclick = function () {
            app.isRandom = !app.isRandom
            randomBtn.classList.toggle('active', app.isRandom)
        }

        // Xử lý khi click nút repeat
        repeatBtn.onclick = function () {
            app.isRepeat = !app.isRepeat
            repeatBtn.classList.toggle('active', app.isRepeat)
        }

        // Xử lý tự chuyển bài khi hết nhạc
        audio.onended = function () {
            if(app.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Xử lý chuyển bài khi click
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                // Xử lý khi click vào playlist
                if(songNode) {
                    app.currentIndex = Number(songNode.getAttribute('index'))
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                }
            }
        }
    },
    
    scrollView: function () {
        setTimeout (function () {
            $('.song.active').scrollIntoView({
                behavior: "smooth", 
                block: "end", 
                // inline: "nearest"
            })
        }, 200)
    },
    
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
        
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    randomSong: function () {
        let nextRandom
        do {
            nextRandom = Math.floor(Math.random() * this.songs.length)
        } while (nextRandom === this.currentIndex)
        this.currentIndex = nextRandom
        this.loadCurrentSong()
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}"  index = "${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>

                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>

                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },

    start: function() {
        // Định nghĩa thuộc tính cho object
        this.defineProperties()
        // Lắng nghe xử lý các sự kiện
        this.handleEvent()
        // Tải bài hát đầu tiên
        this.loadCurrentSong()
        this.render()
    }
}

app.start()