import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: Request) {
  try {
    // Get deposit ID from URL parameters
    const { searchParams } = new URL(request.url);
    const depositIds = searchParams.get('depositIds')?.split(',').map(Number) || [];

    if (!depositIds.length) {
      return NextResponse.json(
        { message: 'No deposits specified' },
        { status: 400 }
      );
    }

    // Fetch deposit data with related customer information
    const deposits = await prisma.datCoc.findMany({
      where: {
        idDatCoc: {
          in: depositIds
        }
      },
      include: {
        khachHang: true,
        xe: true
      }
    });

    if (!deposits.length) {
      return NextResponse.json(
        { message: 'No deposits found' },
        { status: 404 }
      );
    }

    // Generate vehicle details table rows
    const vehicleTableRows = deposits.map(deposit => `
      <tr>
        <td>${deposit.xe?.TenXe || ''}</td>
        <td>${deposit.xe?.NamSanXuat || ''}</td>
        <td>${deposit.xe?.DongCo || ''}</td>
        <td>${deposit.xe?.MauSac || ''}</td>
        <td>1</td>
        <td>${new Intl.NumberFormat('vi-VN').format(Number(deposit.SotienDat))} VNĐ</td>
      </tr>
    `).join('');

    // Calculate total deposit amount
    const totalAmount = deposits.reduce((sum, deposit) => 
      sum + (Number(deposit.SotienDat) || 0), 0
    );

    const htmlContent = `
      <html>
        <head>
          <style>
            body { 
              font-family: 'Times New Roman', Times, serif;
              margin: 20px;
              font-size: 15px;
              line-height: 1.5;
            }
            .header {
              text-align: center;
              font-weight: bold;
              font-size: 18px;
              margin-bottom: 20px;
            }
            .sub-header {
              text-align: center;
              font-style: italic;
              margin-bottom: 30px;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 10px;
            }
            p {
              margin: 8px 0;
              text-align: justify;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .note {
              font-style: italic;
              margin-top: 20px;
            }
            .signatures {
              display: flex;
              justify-content: space-between;
              margin-top: 50px;
              text-align: center;
            }
            .signature-block {
              width: 45%;
              padding: 20px;
            }
            .signature-line {
              margin-top: 50px;
              border-top: 1px solid #000;
            }
          </style>
        </head>
        <body>
          <div class="header">
            ĐIỀU KHOẢN CHUNG<br>
            VỀ VIỆC ĐẶT CỌC MUA BÁN XE Ô TÔ VINFAST
          </div>
          
          <div class="sub-header">
            (Áp dụng cho xe ô tô điện từ ngày ${new Date().toLocaleDateString('vi-VN')} đến hết ngày ${new Date(new Date().setMonth(new Date().getMonth() + 3)).toLocaleDateString('vi-VN')})
          </div>
          
          <div class="note">
            Vui lòng đọc kỹ các điều khoản và điều kiện về việc đặt cọc mua xe VinFast này ("Điều Khoản Đặt
            Cọc") trước khi quyết định đặt bất kỳ sản phẩm nào từ Vinfastauto.com. Bằng việc xác nhận đồng
            ý với nội dung Điều Khoản Đặt Cọc và hoàn tất việc chuyển tiền đặt cọc, Khách Hàng được hiểu
            rằng đã đọc, hiểu và đồng ý với tất cả các điều khoản và điều kiện của Điều Khoản Đặt Cọc.
          </div>

          <div class="section">
            <div class="section-title">ĐIỀU 1. THỎA THUẬN ĐẶT CỌC</div>
            <p>1.1. Để đảm bảo cho việc giao kết hợp đồng mua bán xe ô tô VinFast ("Hợp Đồng") sẽ được ký
            kết trực tiếp giữa Khách Hàng và Công ty TNHH Kinh Doanh Thương Mại và Dịch Vụ
            VinFast (MSDN: 0108926276) ("VinFast Trading"), Khách Hàng đồng ý đặt cọc cho
            VinFast Trading để mua xe ô tô VinFast với thông tin về sản phẩm được Khách Hàng lựa
            chọn và xác nhận ("Đơn Hàng") cùng với Điều Khoản Đặt Cọc này, theo các nội dung dưới
            đây.</p>
            <p>1.2. Việc Khách Hàng thực hiện đặt hàng, chấp thuận Điều Khoản Đặt Cọc này và thanh toán Tiền
            Đặt Cọc (như được định nghĩa dưới đây) cùng với việc VinFast Trading xác nhận Đơn Hàng
            tạo thành thỏa thuận đặt cọc có hiệu lực pháp lý ràng buộc Khách Hàng và VinFast Trading
            ("Thỏa Thuận Đặt Cọc"). Khách Hàng cam kết đồng ý và tuân thủ đầy đủ chính sách bán
            hàng của VinFast Trading, chính sách của Vinfastauto.com tại thời điểm đặt cọc cũng như
            toàn bộ nội dung của Điều Khoản Đặt Cọc và Hợp Đồng do VinFast Trading cung cấp.</p>
          </div>

          <div class="section">
            <div class="section-title">ĐIỀU 2. TIỀN ĐẶT CỌC</div>
            <p>2.1. Khách Hàng đặt cọc cho VinFast Trading số tiền ("Tiền Đặt Cọc") để mua xe ô tô nhãn hiệu
            VinFast với thông tin nêu tại Điều 1 Điều Khoản Đặt Cọc và theo các điều kiện và điều khoản
            nêu tại Hợp Đồng theo mẫu được VinFast Trading công bố và được chấp thuận bởi Khách
            Hàng trong quá trình đặt hàng tại Vinfastauto.com.</p>
            
            <p>2.2. Khách Hàng chuyển Tiền Đặt Cọc cho VinFast Trading bằng một trong các cách thức sau:</p>
            <p>&nbsp;&nbsp;&nbsp;- Thanh toán qua thẻ tín dụng;</p>
            <p>&nbsp;&nbsp;&nbsp;- Thanh toán qua ATM nội địa;</p>
            <p>&nbsp;&nbsp;&nbsp;- Thanh toán qua chuyển khoản ngân hàng vào tài khoản của VinFast Trading.</p>
            <p>Trong vòng 24 giờ kể từ thời điểm nhận được Tiền Đặt Cọc, VinFast Trading sẽ gửi cho
            Khách Hàng xác nhận về việc đặt cọc tới địa chỉ email của Khách Hàng theo thông tin đã đăng
            ký trên Website https://vinfastauto.com/vn_vi ("Email") . Việc đặt cọc được coi là có hiệu
            lực kể từ thời điểm Khách Hàng nhận được thông báo xác nhận Đơn Hàng của VinFast
            Trading gửi từ địa chỉ Email: noreply.vn@vinfastauto.com ("Thời Điểm Hoàn Tất Đặt
            Cọc").</p>
            
            <p>2.3. Thời hạn đặt cọc ("Thời Hạn Đặt Cọc") bắt đầu từ Thời Điểm Hoàn Tất Đặt Cọc đến ngày
            hai bên hoàn tất ký kết Hợp Đồng theo thông báo của VinFast Trading gửi cho Khách Hàng
            bằng văn bản gửi qua đường bưu điện hoặc Email ("Thông Báo"). Trong Thời Hạn Đặt Cọc,
            Tiền Đặt Cọc không phát sinh lãi.</p>
            
            <p>2.4. Tiền Đặt Cọc là không hoàn lại và được xử lý như sau:</p>
            <p>&nbsp;&nbsp;&nbsp;a. Nếu hai bên hoàn tất thủ tục ký kết Hợp Đồng trong thời gian và địa điểm theo Thông
            Báo thì Thỏa Thuận Đặt Cọc chấm dứt và Tiền Đặt Cọc được chuyển đổi thành khoản
            thanh toán đợt 1 của Hợp Đồng.</p>
            <p>&nbsp;&nbsp;&nbsp;b. Khách Hàng không ký Hợp Đồng trong thời gian và tại địa điểm theo Thông Báo thì
            VinFast Trading được quyền chấm dứt Thỏa thuận Đặt Cọc và giữ lại/sở hữu Tiền
            Đặt Cọc.</p>
          </div>
          
          <div class="section">
            <div class="section-title">ĐIỀU 3. QUY ĐỊNH CHUNG</div>
            <p>3.1 Khách Hàng được quyền chuyển nhượng/chuyển giao các quyền và nghĩa vụ theo Thỏa Thuận
            Đặt Cọc cho bên thứ ba theo sự hướng dẫn của VinFast Trading.</p>
            <p>Khách Hàng đồng ý rằng VinFast Trading có thể chuyển giao quyền và nghĩa vụ của mình
            theo Thỏa Thuận Đặt Cọc cho bất kỳ bên thứ ba (bao gồm nhưng không giới hạn các đại
            lý/nhà phân phối chính thức của VinFast Trading) với điều kiện không làm ảnh hưởng tới
            quyền lợi của Khách Hàng sau khi gửi cho Khách Hàng thông báo bằng văn bản ít nhất 05
            (năm) ngày làm việc trước ngày chuyển giao (bao gồm cả các hình thức thông báo qua ứng
            dụng, tin nhắn SMS). Trong vòng 05 (năm) ngày làm việc kể từ ngày thông báo mà VinFast
            Trading không nhận được ý kiến phản hồi bằng văn bản của Khách Hàng thì được hiểu là
            Khách Hàng đã chấp thuận việc chuyển giao nêu trên.</p>
            
            <p>3.2 Khách Hàng không được quyền thay đổi loại xe, màu xe và các thông số khác với quy định
            tại Điều 1 bên trên.</p>
            
            <p>3.3 Thỏa Thuận Đặt Cọc có hiệu lực ràng buộc các bên kể từ Thời Điểm Hoàn Tất Đặt Cọc và
            chấm dứt khi:</p>
            <p>&nbsp;&nbsp;&nbsp;a. Theo quy định tại Điều 2.4;</p>
            <p>&nbsp;&nbsp;&nbsp;b. Các trường hợp khác theo thỏa thuận của hai bên hoặc theo quy định của pháp luật.</p>
            
            <p>3.4. Ngoại trừ các biện pháp xử lý Tiền Đặt Cọc được quy định trong Thỏa Thuận này, không bên
            nào phải thanh toán thêm bất kỳ khoản tiền phạt, bồi thường nào cho bên còn lại hoặc phải
            chịu trách nhiệm theo bất kỳ hình thức nào khác.</p>
            
            <p>3.5 Thỏa Thuận Đặt Cọc được điều chỉnh theo pháp luật Việt Nam. Bất kỳ tranh chấp nào liên
            quan đến Thỏa Thuận Đặt Cọc trước tiên sẽ được các bên giải quyết thông qua thương lượng.
            Nếu sau 30 ngày kể từ ngày phát sinh tranh chấp mà các bên vẫn không đạt được thỏa thuận
            thì tranh chấp đó sẽ được giải quyết tại Tòa án có thẩm quyền của Việt Nam.</p>
          </div>

          <div class="section">
            <div class="section-title">THÔNG TIN XE ĐẶT CỌC</div>
            <table>
              <tr>
                <th>Tên Xe</th>
                <th>Năm sản xuất</th>
                <th>Động cơ</th>
                <th>Màu ngoại thất</th>
                <th>Số lượng</th>
                <th>Tiền đặt cọc</th>
              </tr>
              ${vehicleTableRows}
              <tr>
                <th colspan="5">Tổng tiền đặt cọc:</th>
                <td>${new Intl.NumberFormat('vi-VN').format(totalAmount)} VNĐ</td>
              </tr>
            </table>
          </div>

          <div class="signatures">
            <div class="signature-block">
              <strong>KHÁCH HÀNG</strong>
              <div class="signature-line"></div>
              <p>(Ký và ghi rõ họ tên)</p>
            </div>
            <div class="signature-block">
              <strong>ĐẠI DIỆN VINFAST TRADING</strong>
              <div class="signature-line"></div>
              <p>(Ký, đóng dấu và ghi rõ họ tên)</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=dieu-khoan-dat-coc.pdf',
      },
    });
  } catch (error) {
    console.error('Error generating deposit policy PDF:', error);
    return NextResponse.json({ message: 'Error generating deposit policy PDF' }, { status: 500 });
  }
}