const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const botToken = '7860817713:AAFh-V6rsefsbL-G3vKzhQPJfY-c2dxNqmw';
      const chatId = '7610053738';
      const text = `New Support Message:\n\nName: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\nMessage: ${formData.message}`;
      
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text
        })
      });
  
      if (!response.ok) throw new Error('Request failed');
  
      showAlert('success', 'Thank you! Your message has been sent.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      showAlert('error', 'Message failed to send. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };