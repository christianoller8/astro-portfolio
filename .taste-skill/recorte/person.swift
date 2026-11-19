// Máscara de persona con Vision (calidad alta). Guarda la máscara en gris, al tamaño de la foto.
// Uso: swift person.swift <entrada.jpg> <mascara.png>
import Foundation
import Vision
import CoreImage

let args = CommandLine.arguments
guard let source = CIImage(contentsOf: URL(fileURLWithPath: args[1]), options: [.applyOrientationProperty: true]) else { fatalError("no se pudo leer") }
let handler = VNImageRequestHandler(ciImage: source, options: [:])
let request = VNGeneratePersonSegmentationRequest()
request.qualityLevel = .accurate
request.outputPixelFormat = kCVPixelFormatType_OneComponent8
try handler.perform([request])
guard let buffer = request.results?.first?.pixelBuffer else { fatalError("sin máscara") }
var mask = CIImage(cvPixelBuffer: buffer)
print("máscara", mask.extent.width, mask.extent.height)
let sx = source.extent.width / mask.extent.width, sy = source.extent.height / mask.extent.height
mask = mask.transformed(by: CGAffineTransform(scaleX: sx, y: sy))
let context = CIContext()
try context.writePNGRepresentation(of: mask, to: URL(fileURLWithPath: args[2]), format: .L8, colorSpace: CGColorSpace(name: CGColorSpace.linearGray)!)
print("ok")
