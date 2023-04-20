Sử dụng graphQL thì nhớ 2 định nghĩa: 

1. Schema : gồm 3 type:
	+ Query: hoạt động trong việc client truy vấn dữ liêu
	+ Mutation: update, xóa dữ liệu
	+ Subscription: update theo realtime(bất kỳ sự thay đổi nào bên server-> trả về realtime).




Router V6:
1. Tạo một biến Layout trả về <Outlet />
2. Mỗi khi load theo path thì sẽ trả về component của path đó thay cho Outlet