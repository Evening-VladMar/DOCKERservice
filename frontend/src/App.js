import React, { useState } from 'react';
import { Button, TextField, Typography, CircularProgress, Grid, MenuItem, Select, InputLabel, FormControl, Container, Box } from '@mui/material';

function App() {
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [techStack, setTechStack] = useState("python:3.8");
    const [requirementsFile, setRequirementsFile] = useState(null); 
    const [fileName, setFileName] = useState("app.py");  // Стейт для имени исполняемого файла
    const [loading, setLoading] = useState(false); // Стейт для индикатора загрузки
    const [message, setMessage] = useState(""); // Сообщение для пользователя

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleRequirementsFileChange = (e) => {
        setRequirementsFile(e.target.files[0]);
    };

    const handleFileNameChange = (e) => {
        setFileName(e.target.value);  // Обновляем имя исполняемого файла
    };

    const handleSubmit = async () => {
        if (!selectedFiles) {
            alert("Пожалуйста, выберите файл проекта!");
            return;
        }
        
        const formData = new FormData();
        formData.append("project_files", selectedFiles[0]);
        formData.append("tech_stack", techStack);

        if (requirementsFile) {
            formData.append("user_requirements", requirementsFile);
        }

        formData.append("executable_file", fileName);  // Добавляем имя исполняемого файла
        
        // Логируем все данные перед отправкой
        console.log("Sending data to backend:");
        console.log("Project File:", selectedFiles[0]);
        console.log("Tech Stack:", techStack);
        console.log("Executable File:", fileName);
        console.log("Requirements File:", requirementsFile ? requirementsFile.name : "None");

        setLoading(true);
        setMessage(""); // Очищаем предыдущее сообщение

        try {
            const response = await fetch("http://127.0.0.1:8000/create_docker_image/", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            setMessage(`Docker образ успешно создан! Сохранён по пути: ${result.image_path}`);
        } catch (error) {
            console.error("Error:", error);
            setMessage("Ошибка при создании Docker образа!");
        } finally {
            setLoading(false); // Завершаем загрузку
        }
    };

    return (
        <div style={{ backgroundColor: '#e6f7ff', minHeight: '10vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '5px', alignItems: 'center', backgroundColor: '#0056b3'}}>
                <img src="/logo1.png" alt="Logo" style={{ height: '90px' }} />
                <Box>
                    <Button 
                    variant="outlined" 
                    sx={{ 
                        marginRight: 2, 
                        color: '#ffffff',  // Белый текст на темном фоне
                        borderColor: '#ffffff',  // Белая рамка
                        backgroundColor: '#007bff', // Добавим фон для контраста
                        '&:hover': { backgroundColor: '#0056b3' } // Цвет при наведении
                    }}
                    >
                    Login
                    </Button>

                    <Button 
                    variant="contained" 
                    sx={{ 
                        backgroundColor: '#ffffff',  // Белый фон для кнопки
                        color: '#0056b3',  // Темно-синий текст
                        '&:hover': { backgroundColor: '#e6f7ff' }  // При наведении светлый фон
                    }}
                    >
                    Sign Up
                    </Button>
                </Box>
            </Box>

            <Container maxWidth="sm" style={{ paddingTop: 40, paddingBottom: 0 }}>
                <Typography 
                variant="h3" 
                align="center" 
                gutterBottom
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                    width: '100%',
                    fontFamily: 'Roboto Mono, monospace',  // Изменяем шрифт
                    fontWeight: 'bold',  // Устанавливаем жирное начертание
                    letterSpacing: '2px',  // Добавляем расстояние между буквами
                    textTransform: 'uppercase',  // Преобразуем в верхний регистр
                    color: '#000000',  // Цвет текста
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',  // Тень для текста
                }}
                >
                DOCKER IMAGE GENERATOR
                </Typography>
                <Typography variant="h6" align="center" paragraph>
                    Создайте Docker образ для вашего проекта. Просто загрузите файлы и выберите стек технологий.
                </Typography>
            </Container>
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #00bcd4 0%, #00796b 100%)',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    marginTop: '20px',
                    width: '52%',
                    maxWidth: '1200px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '40px',
                }}
            >
                <form>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Выберите файл проекта"
                                type="file"
                                fullWidth
                                inputProps={{ accept: ".py,.js,.txt" }}
                                onChange={handleFileChange}
                                style={{
                                    marginBottom: 16,
                                    borderRadius: '10px',
                                    backgroundColor: '#ffffff',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    border: '2px solid #00796b',
                                    padding: '10px',
                                    boxSizing: 'border-box',
                                    width: '315px',
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { 
                                        marginTop: '8px', // Отступ сверху, чтобы текст не перекрывался рамкой
                                        fontSize: '16px',
                                        marginLeft: '10px',
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Введите имя исполняемого файла"
                                type="text"
                                fullWidth
                                value={fileName}
                                onChange={handleFileNameChange}
                                style={{
                                    marginBottom: 16,
                                    borderRadius: '10px',
                                    backgroundColor: '#ffffff',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    border: '2px solid #00796b',
                                    padding: '10px',
                                    boxSizing: 'border-box',
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { 
                                        marginTop: '8px',  // Отступ сверху для текста
                                        fontSize: '16px',
                                        marginLeft: '10px',
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth style={{ marginBottom: 24 }}>
                                <InputLabel style={{ color: '#6b6b6b', marginTop: '8px' }}>Выберите язык</InputLabel>
                                <Select
                                    value={techStack}
                                    label="Выберите язык"
                                    onChange={(e) => setTechStack(e.target.value)}
                                    style={{
                                        marginBottom: 2,
                                        fontSize: '16px',
                                        fontWeight: '500',
                                        padding: '8px 12px',
                                        borderRadius: '10px',
                                        border: '2px solid #00796b',
                                        backgroundColor: '#ffffff',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    <MenuItem value="python:3.8">Python 3.8</MenuItem>
                                    <MenuItem value="python:3.9">Python 3.9</MenuItem>
                                    <MenuItem value="python:3.12">Python 3.12</MenuItem>
                                    <MenuItem value="node:14">Node 14</MenuItem>
                                    <MenuItem value="node:16">Node 16</MenuItem>
                                    <MenuItem value="node:18">Node 18</MenuItem>
                                    <MenuItem value="java:11">Java 11</MenuItem>
                                    <MenuItem value="java:17">Java 17</MenuItem>
                                    <MenuItem value="java:19">Java 19</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Загрузите файл requirements.txt (если есть)"
                                type="file"
                                fullWidth
                                inputProps={{ accept: ".txt" }}
                                onChange={handleRequirementsFileChange}
                                style={{
                                    marginBottom: 2,
                                    borderRadius: '10px',
                                    backgroundColor: '#ffffff',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    border: '2px solid #00796b',
                                    padding: '10px',
                                    boxSizing: 'border-box',
                                    width: '315px',
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { 
                                        marginTop: '8px',  // Добавляем отступ сверху для текста
                                        fontSize: '16px',
                                        marginLeft: '10px',
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </form>
            </Box>


                {/* Новый блок для кнопки создания образа, который будет ниже */}
                <Box
                    sx={{
                        display: 'flex',  // Выравнивание элементов в ряд
                        justifyContent: 'space-between', // Расстояние между кнопками
                        width: '51%',
                        maxWidth: '1200px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginBottom: '27px',  // Отступ снизу
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            backgroundColor: '#007bff',
                            borderRadius: '25px', // Скругление кнопки
                            padding: '12px 24px',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            '&:hover': { backgroundColor: '#0056b3' }, // Темный синий при наведении
                            width: 'auto',  // Убираем растяжение кнопки на всю ширину
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Создать Docker Image"}
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={true}  // Кнопка всегда недоступна
                        style={{
                            backgroundColor: '#b0c4de',  // Светло-синий цвет, чтобы она выглядела тускло
                            borderRadius: '25px', // Скругление кнопки
                            padding: '12px 24px',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            boxShadow: 'none',  // Убираем тень, чтобы не было яркого эффекта
                            '&:hover': { backgroundColor: '#b0c4de' }, // Нет эффекта наведения
                            width: 'auto',  // Убираем растяжение кнопки на всю ширину
                            opacity: 0.7, // Уменьшаем прозрачность для тусклого эффекта
                            pointerEvents: 'none', // Отключаем клики
                            color: '#a9a9a9',  // Цвет текста делаем светлым, чтобы не выделялся
                        }}
                    >
                        Скачать
                    </Button>


                </Box>

            <div style={{ backgroundColor: '#dbe2e8', padding: '20px', textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                    <a href="#">О проекте</a> | <a href="#">Пользовательское соглашение</a> | <a href="#">Контакты</a>
                </Typography>
            </div>
        </div>
    );
}

export default App;
